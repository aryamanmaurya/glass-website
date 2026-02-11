// Glass Fitting Website - Main JavaScript

documentDOMContentLoaded',.addEventListener(' function() {
    
    // Initialize all functionality
    initNavigation();
    initScrollEffects();
    initContactForm();
    initMobileMenu();
    initSmoothScrolling();
    initFadeInAnimation();
    
});

// Navigation functionality
function initNavigation() {
    const navLinks = document.querySelectorAll('.nav-link');
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    
    // Set active navigation link
    navLinks.forEach(link => {
        const href = link.getAttribute('href');
        if (href === currentPage || (currentPage === '' && href === 'index.html')) {
            link.classList.add('active');
        }
    });
}

// Mobile menu toggle
function initMobileMenu() {
    const mobileToggle = document.querySelector('.mobile-menu-toggle');
    const navMenu = document.querySelector('.nav-menu');
    
    if (mobileToggle && navMenu) {
        mobileToggle.addEventListener('click', function() {
            navMenu.classList.toggle('active');
            mobileToggle.classList.toggle('active');
        });
        
        // Close menu when clicking outside
        document.addEventListener('click', function(e) {
            if (!mobileToggle.contains(e.target) && !navMenu.contains(e.target)) {
                navMenu.classList.remove('active');
                mobileToggle.classList.remove('active');
            }
        });
    }
}

// Smooth scrolling for anchor links
function initSmoothScrolling() {
    const links = document.querySelectorAll('a[href^="#"]');
    
    links.forEach(link => {
        link.addEventListener('click', function(e) {
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                e.preventDefault();
                const headerHeight = document.querySelector('.header').offsetHeight;
                const targetPosition = target.offsetTop - headerHeight - 20;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Scroll effects
function initScrollEffects() {
    const header = document.querySelector('.header');
    let lastScrollTop = 0;
    
    window.addEventListener('scroll', function() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        // Header background opacity on scroll
        if (scrollTop > 50) {
            header.style.backgroundColor = 'rgba(255, 255, 255, 0.95)';
            header.style.backdropFilter = 'blur(10px)';
        } else {
            header.style.backgroundColor = '#FFFFFF';
            header.style.backdropFilter = 'none';
        }
        
        lastScrollTop = scrollTop;
    });
}

// Contact form handling
function initContactForm() {
    const contactForm = document.getElementById('contact-form');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const formData = new FormData(contactForm);
            const name = formData.get('name');
            const phone = formData.get('phone');
            const location = formData.get('location');
            const message = formData.get('message');
            
            // Validate form
            if (!name || !phone || !location || !message) {
                showMessage('Please fill in all fields.', return;
            }
 'error');
                           
            // Validate phone number (basic validation)
            const phoneRegex = /^[+]?[\d\s\-()]+$/;
            if (!phoneRegex.test(phone)) {
                showMessage('Please enter a valid phone number.', 'error');
                return;
            }
            
            // Create email content
            const emailContent = `
New Inquiry from Website

Name: ${name}
Phone: ${phone}
Location: ${location}
Message: ${message}

---
Sent from Glass Fitting Website
            `.trim();
            
            // Create mailto link
            const subject = encodeURIComponent('New Glass Fitting Inquiry');
            const body = encodeURIComponent(emailContent);
            const mailtoLink = `mailto:your-email@example.com?subject=${subject}&body=${body}`;
            
            // Open email client
            window.location.href = mailtoLink;
            
            // Show success message
            showMessage('Thank you! Your email client should open now. Please send the email to complete your inquiry.', 'success');
            
            // Reset form
            contactForm.reset();
        });
    }
}

// WhatsApp integration
function initWhatsAppIntegration() {
    const whatsappLinks = document.querySelectorAll('[data-whatsapp]');
    
    whatsappLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const phoneNumber = this.getAttribute('data-whatsapp');
            const message = this.getAttribute('data-message') || 'Hello, I am interested in your glass fitting services.';
            
            const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
            window.open(whatsappUrl, '_blank');
        });
    });
}

// Phone call integration
function initPhoneIntegration() {
    const phoneLinks = document.querySelectorAll('[data-phone]');
    
    phoneLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const phoneNumber = this.getAttribute('data-phone');
            // On mobile, this will trigger the phone app
            // On desktop, it might show an error or try to open a VoIP app
        });
    });
}

// Gallery filtering
function initGalleryFiltering() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const galleryItems = document.querySelectorAll('.gallery-item');
    
    if (filterButtons.length > 0 && galleryItems.length > 0) {
        filterButtons.forEach(button => {
            button.addEventListener('click', function() {
                const filter = this.getAttribute('data-filter');
                
                // Update active button
                filterButtons.forEach(btn => btn.classList.remove('active'));
                this.classList.add('active');
                
                // Filter gallery items
                galleryItems.forEach(item => {
                    const category = item.getAttribute('data-category');
                    
                    if (filter === 'all' || category === filter) {
                        item.style.display = 'block';
                        item.style.animation = 'fadeIn 0.5s ease-in-out';
                    } else {
                        itemnone';
                    }
.style.display = '                });
            });
        });
    }
}

// Fade in animation on scroll
function initFadeInAnimation() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);
    
    // Observe elements with fade-in class
    const fadeElements = document.querySelectorAll('.fade-in');
    fadeElements.forEach(element => {
        observer.observe(element);
    });
}

// Utility functions
function showMessage(message, type = 'info') {
    // Remove existing messages
    const existingMessage = document.querySelector('.message');
    if (existingMessage) {
        existingMessage.remove();
    }
    
    // Create message element
    const messageDiv = document.createElement('div');
    messageDiv.className = `message message-${type}`;
    messageDiv.innerHTML = `
        <span>${message}</span>
        <button class="message-close">&times;</button>
    `;
    
    // Style the message
    messageDiv.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? '#38A169' : type === 'error' ? '#E53E3E' : '#3182CE'};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 0.5rem;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        z-index: 1000;
        max-width: 400px;
        animation: slideInRight 0.3s ease-out;
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 1rem;
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
    
    // Add to page
    document.body.appendChild(messageDiv);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (messageDiv.parentNode) {
            messageDiv.remove();
        }
    }, 5000);
}

// Phone number formatting
function formatPhoneNumber(input) {
    // Remove all non-digits
    let value = input.value.replace(/\D/g, '');
    
    // Format as Indian phone number
    if (value.length > 10) {
        value = value.substring(0, 10);
    }
    
    // Format as XXX-XXX-XXXX
    if (value.length >= 6) {
        input.value = `${value.substring(0, 3)}-${value.substring(3, 6)}-${value.substring(6)}`;
    } else if (value.length >= 3) {
        input.value = `${value.substring(0, 3)}-${value.substring(3)}`;
    } else {
        input.value = value;
    }
}

// Initialize phone number formatting
document.addEventListener('DOMContentLoaded', function() {
    const phoneInputs = document.querySelectorAll('input[type="tel"]');
    phoneInputs.forEach(input => {
        input.addEventListener('input', function() {
            formatPhoneNumber(this);
        });
    });
});

// Image lazy loading
function initLazyLoading() {
    const images = document.querySelectorAll('img[data-src]');
    
    const imageObserver = new IntersectionObserver(function(entries, observer) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('lazy');
                imageObserver.unobserve(img);
            }
        });
    });
    
    images.forEach(img => imageObserver.observe(img));
}

// Performance optimization
function initPerformanceOptimizations() {
    // Preload critical resources
    const criticalImages = [
        'images/hero/hero-bg.jpg',
        'images/services/window-service.jpg'
    ];
    
    criticalImages.forEach(src => {
        const link = document.createElement('link');
        link.rel = 'preload';
        link.as = 'image';
        link.href = src;
        document.head.appendChild(link);
    });
}

// Initialize performance optimizations
document.addEventListener('DOMContentLoaded', function() {
    initPerformanceOptimizations();
    initLazyLoading();
    initGalleryFiltering();
    initWhatsAppIntegration();
    initPhoneIntegration registration for();
});

// Service Worker PWA capabilities (optional)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
        navigator.serviceWorker.register('/sw.js')
            .then(function(registration) {
                console.log('SW registered: ', registration);
            })
            .catch(function(registrationError) {
                console.log('SW registration failed: ', registrationError);
            });
    });
}

// Analytics tracking (placeholder)
function trackEvent(category, action, label) {
    // Placeholder for analytics tracking
    // Replace with your analytics service (Google Analytics, etc.)
    console.log(`Event tracked: ${category} - ${action} - ${label}`);
    
    // Example Google Analytics 4 tracking:
    // gtag('event', action, {
    //     event_category: category,
    //     event_label: label
    // });
}

// Track important user interactions
document.addEventListener('click', function(e) {
    // Track phone clicks
    if (e.target.closest('[data-phone]')) {
        trackEvent('Contact', 'Phone Call', 'Header Phone');
    }
    
    // Track WhatsApp clicks
    if (e.target.closest('[data-whatsapp]')) {
        trackEvent('Contact', 'WhatsApp Click', 'Header WhatsApp');
    }
    
    // Track contact form submissions
    if (e.target.closest('#contact-form [type="submit"]Event('Contact',')) {
        track 'Form Submit', 'Contact Form');
    }
});

// Error handling
window.addEventListener('error', function(e) {
    console.error('JavaScript error:', e.error);
    // You can send this to your error tracking service
});

// Export functions for testing (if needed)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        initNavigation,
        initMobileMenu,
        initContactForm,
        showMessage
    };
}