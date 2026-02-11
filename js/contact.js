// Contact functionality for contact page and forms

document.addEventListener('DOMContentLoaded', function() {
    initContactForms();
    initPhoneIntegration();
    initWhatsAppIntegration();
    initLocationMap();
    initContactValidation();
});

// Initialize contact forms
function initContactForms() {
    const contactForms = document.querySelectorAll('.contact-form, #contact-form');
    
    contactForms.forEach(form => {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            handleContactFormSubmission(this);
        });
    });
}

// Handle contact form submission
function handleContactFormSubmission(form) {
    const formData = new FormData(form);
    const submitButton = form.querySelector('button[type="submit"]');
    
    // Disable submit button during processing
    if (submitButton) {
        submitButton.disabled = true;
        submitButton.textContent = 'Sending...';
    }
    
    // Validate form data
    const validation = validateContactForm(formData);
    if (!validation.isValid) {
        showFormMessage(form, validation.message, 'error');
        resetSubmitButton(submitButton);
        return;
    }
    
    // Prepare email content
    const emailContent = prepareEmailContent(formData);
    
    // Create mailto link
    const subject = encodeURIComponent('New Glass Fitting Inquiry');
    const body = encodeURIComponent(emailContent);
    const mailtoLink = `mailto:your-email@example.com?subject=${subject}&body=${body}`;
    
    // Open email client
    window.location.href = mailtoLink;
    
    // Show success message
    showFormMessage(form, 
        'Thank you for your inquiry! Your email client should open now. Please send the email to complete your inquiry. We will respond within 24 hours.', 
        'success'
    );
    
    // Track form submission
    trackContactSubmission('email_form', formData);
    
    // Reset form after delay
    setTimeout(() => {
        form.reset();
        resetSubmitButton(submitButton);
    }, 2000);
}

// Validate contact form
function validateContactForm(formData) {
    const name = formData.get('name')?.trim();
    const phone = formData.get('phone')?.trim();
    const location = formData.get('location')?.trim();
    const message = formData.get('message')?.trim();
    
    // Required fields validation
    if (!name) {
        return { isValid: false, message: 'Please enter your name.' };
    }
    
    if (!phone) {
        return { isValid: false, message: 'Please enter your phone number.' };
    }
    
    if (!location) {
        return { isValid: false, message: 'Please enter your location.' };
    }
    
    if (!message) {
        return { isValid: false, message: 'Please enter your message.' };
    }
    
    // Phone number validation
    const phoneRegex = /^[+]?[\d\s\-()]{10,}$/;
    if (!phoneRegex.test(phone.replace(/\s/g, ''))) {
        return { isValid: false, message: 'Please enter a valid phone number (minimum 10 digits).' };
    }
    
    // Name validation (at least 2 characters, letters only)
    if (name.length < 2 || !/^[a-zA-Z\s]+$/.test(name)) {
        return { isValid: false, message: 'Please enter a valid name (letters only, minimum 2 characters).' };
    }
    
    // Message length validation
    if (message.length < 10) {
        return { isValid: false, message: 'Please provide more details in your message (minimum 10 characters).' };
    }
    
    return { isValid: true };
}

// Prepare email content
function prepareEmailContent(formData) {
    const name = formData.get('name');
    const phone = formData.get('phone');
    const email = formData.get('email') || 'Not provided';
    const location = formData.get('location');
    const message = formData.get('message');
    const service = formData.get('service') || 'General Inquiry';
    const urgency = formData.get('urgency') || 'Normal';
    
    return `
NEW GLASS FITTING INQUIRY

═══════════════════════════════════════

CONTACT INFORMATION:
Name: ${name}
Phone: ${phone}
Email: ${email}
Location: ${location}

SERVICE DETAILS:
Service Type: ${service}
Urgency: ${urgency}

MESSAGE:
${message}

═══════════════════════════════════════

INQUIRY DETAILS:
Date: ${new Date().toLocaleDateString('en-IN')}
Time: ${new Date().toLocaleTimeString('en-IN')}
Source: Website Contact Form

═══════════════════════════════════════

Please respond to this inquiry within 24 hours.
Customer is expecting a prompt response.

---
Sent from Glass Fitting Website
Contact System
    `.trim();
}

// Show form message
function showFormMessage(form, message, type = 'info') {
    // Remove existing messages
    const existingMessage = form.querySelector('.form-message');
    if (existingMessage) {
        existingMessage.remove();
    }
    
    // Create message element
    const messageDiv = document.createElement('div');
    messageDiv.className = `form-message form-message-${type}`;
    messageDiv.innerHTML = `
        <span>${message}</span>
        <button class="message-close" type="button">&times;</button>
    `;
    
    // Style the message
    messageDiv.style.cssText = `
        background: ${type === 'success' ? '#38A169' : type === 'error' ? '#E53E3E' : '#3182CE'};
        color: white;
        padding: 1rem;
        border-radius: 0.5rem;
        margin-top: 1rem;
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 1rem;
        animation: slideDown 0.3s ease-out;
    `;
    
    // Add close functionality
    const closeBtn = messageDiv.querySelector('.message-close');
    closeBtn.style.cssText = `
        background: none;
        border: none;
        color: white;
        font-size: 1.25rem;
        cursor: pointer;
        padding: 0;
        width: 20px;
        height: 20px;
        display: flex;
        align-items: center;
        justify-content: center;
    `;
    
    closeBtn.addEventListener('click', function() {
        messageDiv.remove();
    });
    
    // Add to form
    form.appendChild(messageDiv);
    
    // Auto remove after 10 seconds for success messages
    if (type === 'success') {
        setTimeout(() => {
            if (messageDiv.parentNode) {
                messageDiv.remove();
            }
        }, 10000);
    }
}

// Reset submit button
function resetSubmitButton(button) {
    if (button) {
        button.disabled = false;
        button.textContent = 'Send Inquiry';
    }
}

// Phone integration
function initPhoneIntegration() {
    const phoneLinks = document.querySelectorAll('[data-phone]');
    
    phoneLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const phoneNumber = this.getAttribute('data-phone');
            
            // Track phone click
            trackContactSubmission('phone_click', { phone: phoneNumber });
            
            // For mobile devices, this will automatically trigger the phone app
            // For desktop, it might show an error or try to open a VoIP app
            
            // Show a brief message on desktop
            if (!/Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
                showNotification('Opening phone application...', 'info');
            }
        });
    });
}

// WhatsApp integration
function initWhatsAppIntegration() {
    const whatsappLinks = document.querySelectorAll('[data-whatsapp]');
    
    whatsappLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const phoneNumber = this.getAttribute('data-whatsapp');
            const message = this.getAttribute('data-message') || 
                'Hello! I found your website and I am interested in your glass fitting services. Could you please provide more information?';
            
            // Track WhatsApp click
            trackContactSubmission('whatsapp_click', { phone: phoneNumber });
            
            // Create WhatsApp URL
            const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
            
            // Open WhatsApp
            window.open(whatsappUrl, '_blank');
            
            // Show notification
            showNotification('Opening WhatsApp...', 'success');
        });
    });
}

// Location map functionality
function initLocationMap() {
    const mapContainer = document.querySelector('.map-container');
    const locationLinks = document.querySelectorAll('[data-location]');
    
    if (mapContainer) {
        // Initialize map (you would integrate with Google Maps or similar)
        initializeInteractiveMap(mapContainer);
    }
    
    locationLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const location = this.getAttribute('data-location');
            openLocationMap(location);
        });
    });
}

// Initialize interactive map
function initializeInteractiveMap(container) {
    // Placeholder for map initialization
    // You would integrate with Google Maps API here
    container.innerHTML = `
        <div class="map-placeholder">
            <p>📍 Interactive Map</p>
            <p>Mohali, Phase 9</p>
            <small>Service Areas: Mohali, Chandigarh, Panchkula, Kharar</small>
        </div>
    `;
    
    // Add click handler for opening external map
    container.addEventListener('click', function() {
        openExternalMap();
    });
}

// Open location in external map
function openLocationMap(location) {
    const mapUrl = `https://www.google.com/maps/search/glass+fitting+${encodeURIComponent(location)}`;
    window.open(mapUrl, '_blank');
    
    trackContactSubmission('map_click', { location });
}

// Open external map
function openExternalMap() {
    const mapUrl = `https://www.google.com/maps/search/glass+fitting+Mohali+Phase+9`;
    window.open(mapUrl, '_blank');
}

// Contact validation enhancements
function initContactValidation() {
    const phoneInputs = document.querySelectorAll('input[type="tel"]');
    const nameInputs = document.querySelectorAll('input[name="name"]');
    
    // Phone number formatting and validation
    phoneInputs.forEach(input => {
        input.addEventListener('input', function() {
            formatPhoneNumber(this);
            validatePhoneField(this);
        });
        
        input.addEventListener('blur', function() {
            validatePhoneField(this);
        });
    });
    
    // Name validation
    nameInputs.forEach(input => {
        input.addEventListener('input', function() {
            validateNameField(this);
        });
        
        input.addEventListener('blur', function() {
            validateNameField(this);
        });
    });
}

// Format phone number
function formatPhoneNumber(input) {
    let value = input.value.replace(/\D/g, '');
    
    // Handle Indian phone numbers
    if (value.startsWith('91') && value.length > 10) {
        value = value.substring(2); // Remove country code
    }
    
    // Format as XXX-XXX-XXXX
    if (value.length >= 6) {
        input.value = `${value.substring(0, 3)}-${value.substring(3, 6)}-${value.substring(6, 10)}`;
    } else if (value.length >= 3) {
        input.value = `${value.substring(0, 3)}-${value.substring(3)}`;
    } else {
        input.value = value;
    }
}

// Validate phone field
function validatePhoneField(input) {
    const value = input.value.replace(/\D/g, '');
    const field = input.closest('.form-group');
    
    // Remove existing validation styles
    input.classList.remove('field-valid', 'field-invalid');
    
    // Validate
    if (value.length === 10) {
        input.classList.add('field-valid');
        showFieldValidation(field, '✓ Valid phone number', 'success');
    } else if (value.length > 0 && value.length < 10) {
        input.classList.add('field-invalid');
        showFieldValidation(field, '⚠ Phone number should be 10 digits', 'warning');
    }
}

// Validate name field
function validateNameField(input) {
    const value = input.value.trim();
    const field = input.closest('.form-group');
    
    // Remove existing validation styles
    input.classList.remove('field-valid', 'field-invalid');
    
    // Validate
    if (value.length >= 2 && /^[a-zA-Z\s]+$/.test(value)) {
        input.classList.add('field-valid');
        showFieldValidation(field, '✓ Valid name', 'success');
    } else if (value.length > 0) {
        input.classList.add('field-invalid');
        showFieldValidation(field, '⚠ Name should contain letters only', 'warning');
    }
}

// Show field validation message
function showFieldValidation(field, message, type) {
    // Remove existing validation message
    const existingMessage = field.querySelector('.field-validation');
    if (existingMessage) {
        existingMessage.remove();
    }
    
    // Create validation message
    const validationDiv = document.createElement('div');
    validationDiv.className = 'field-validation';
    validationDiv.textContent = message;
    
    // Style based on type
    const colors = {
        success: '#38A169',
        warning: '#D69E2E',
        error: '#E53E3E'
    };
    
    validationDiv.style.cssText = `
        color: ${colors[type]};
        font-size: 0.875rem;
        margin-top: 0.25rem;
        display: block;
    `;
    
    field.appendChild(validationDiv);
}

// Show notification
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? '#38A169' : type === 'error' ? '#E53E3E' : '#3182CE'};
        color: white;
        padding: 0.75rem 1rem;
        border-radius: 0.5rem;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        z-index: 1000;
        animation: slideInRight 0.3s ease-out;
        max-width: 300px;
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.remove();
    }, 3000);
}

// Track contact submissions
function trackContactSubmission(method, data) {
    // Analytics tracking
    if (typeof gtag !== 'undefined') {
        gtag('event', 'contact_submission', {
            event_category: 'Contact',
            event_label: method,
            value: 1
        });
    }
    
    // Console log for debugging
    console.log(`Contact tracked: ${method}`, data);
    
    // You can send this to your analytics service
    // Example: sendToAnalytics('contact', method, data);
}

// Business hours functionality
function initBusinessHours() {
    const businessHours = {
        monday: { open: '09:00', close: '18:00' },
        tuesday: { open: '09:00', close: '18:00' },
        wednesday: { open: '09:00', close: '18:00' },
        thursday: { open: '09:00', close: '18:00' },
        friday: { open: '09:00', close: '18:00' },
        saturday: { open: '09:00', close: '17:00' },
        sunday: { open: '10:00', close: '16:00' }
    };
    
    const currentStatus = getBusinessStatus(businessHours);
    updateBusinessStatusDisplay(currentStatus);
}

// Get current business status
function getBusinessHours(businessHours) {
    const now = new Date();
    const currentDay = now.toLocaleDateString('en-US', { weekday: 'lowercase' });
    const currentTime = now.toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' });
    
    const today = businessHours[currentDay];
    
    if (!today) {
        return { status: 'closed', message: 'Business closed today' };
    }
    
    if (currentTime >= today.open && currentTime <= today.close) {
        return { 
            status: 'open', 
            message: `Open until ${today.close}`,
            closeTime: today.close
        };
    } else {
        return { 
            status: 'closed', 
            message: `Closed. Opens tomorrow at ${today.open}`,
            openTime: today.open
        };
    }
}

// Update business status display
function updateBusinessStatusDisplay(status) {
    const statusElement = document.querySelector('.business-status');
    if (statusElement) {
        statusElement.textContent = status.message;
        statusElement.className = `business-status status-${status.status}`;
    }
}

// Initialize business hours
document.addEventListener('DOMContentLoaded', function() {
    initBusinessHours();
    
    // Update every minute
    setInterval(initBusinessHours, 60000);
});

// Emergency contact functionality
function initEmergencyContact() {
    const emergencyButton = document.querySelector('.emergency-contact-btn');
    
    if (emergencyButton) {
        emergencyButton.addEventListener('click', function() {
            const phoneNumber = this.getAttribute('data-phone');
            
            // Direct call for emergency
            window.location.href = `tel:${phoneNumber}`;
            
            // Track emergency contact
            trackContactSubmission('emergency_call', { phone: phoneNumber });
            
            showNotification('Calling emergency line...', 'warning');
        });
    }
}

// Initialize emergency contact
document.addEventListener('DOMContentLoaded', function() {
    initEmergencyContact();
});

// Add CSS for validation states
const validationStyles = `
.field-valid {
    border-color: #38A169 !important;
    box-shadow: 0 0 0 3px rgba(56, 161, 105, 0.1) !important;
}

.field-invalid {
    border-color: #E53E3E !important;
    box-shadow: 0 0 0 3px rgba(229, 62, 62, 0.1) !important;
}

.field-validation {
    font-size: 0.875rem;
    margin-top: 0.25rem;
    display: block;
}

.status-open {
    color: #38A169;
}

.status-closed {
    color: #E53E3E;
}

.notification {
    animation: slideInRight 0.3s ease-out;
}

@keyframes slideInRight {
    from {
        transform: translateX(100%);
        opacity: 0;
    }
    to {
        transform: translateX(0);
        opacity: 1;
    }
}

@keyframes slideDown {
    from {
        transform: translateY(-10px);
        opacity: 0;
    }
    to {
        transform: translateY(0);
        opacity: 1;
    }
}
`;

// Add validation styles to head
const styleSheet = document.createElement('style');
styleSheet.textContent = validationStyles;
document.head.appendChild(styleSheet);