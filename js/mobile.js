// Mobile-specific functionality and optimizations

document.addEventListener('DOMContentLoaded', function() {
    initMobileOptimizations();
    initTouchGestures();
    initMobileNavigation();
    initMobileContact();
    initMobilePerformance();
});

// Mobile optimizations
function initMobileOptimizations() {
    // Detect mobile device
    const isMobile = /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    
    if (isMobile) {
        document.body.classList.add('mobile-device');
        
        // Mobile-specific optimizations
        optimizeForMobile();
        initMobileViewport();
        initMobileGestures();
    }
}

// Optimize for mobile
function optimizeForMobile() {
    // Disable hover effects on mobile
    const hoverElements = document.querySelectorAll('.service-card, .gallery-item, .feature-item');
    hoverElements.forEach(element => {
        element.addEventListener('touchstart', function() {
            this.classList.add('mobile-active');
        });
        
        element.addEventListener('touchend', function() {
            setTimeout(() => {
                this.classList.remove('mobile-active');
            }, 150);
        });
    });
    
    // Optimize images for mobile
    optimizeImagesForMobile();
    
    // Add mobile-specific classes
    addMobileClasses();
}

// Optimize images for mobile
function optimizeImagesForMobile() {
    const images = document.querySelectorAll('img');
    
    images.forEach(img => {
        // Add loading="lazy" for better performance
        if (!img.hasAttribute('loading')) {
            img.setAttribute('loading', 'lazy');
        }
        
        // Add mobile-optimized class
        img.classList.add('mobile-optimized');
    });
}

// Add mobile-specific classes
function addMobileClasses() {
    // Add viewport meta tag if missing
    if (!document.querySelector('meta[name="viewport"]')) {
        const viewport = document.createElement('meta');
        viewport.name = 'viewport';
        viewport.content = 'width=device-width, initial-scale=1.0, user-scalable=no';
        document.head.appendChild(viewport);
    }
    
    // Add theme color meta tag
    if (!document.querySelector('meta[name="theme-color"]')) {
        const themeColor = document.createElement('meta');
        themeColor.name = 'theme-color';
        themeColor.content = '#2C5282';
        document.head.appendChild(themeColor);
    }
}

// Initialize mobile viewport
function initMobileViewport() {
    // Set viewport height for mobile browsers
    function setViewportHeight() {
        const vh = window.innerHeight * 0.01;
        document.documentElement.style.setProperty('--vh', `${vh}px`);
    }
    
    setViewportHeight();
    window.addEventListener('resize', setViewportHeight);
    window.addEventListener('orientationchange', setViewportHeight);
}

// Touch gestures
function initTouchGestures() {
    let touchStartX = 0;
    let touchStartY = 0;
    let touchEndX = 0;
    let touchEndY = 0;
    
    document.addEventListener('touchstart', function(e) {
        touchStartX = e.touches[0].clientX;
        touchStartY = e.touches[0].clientY;
    }, { passive: true });
    
    document.addEventListener('touchend', function(e) {
        touchEndX = e.changedTouches[0].clientX;
        touchEndY = e.changedTouches[0].clientY;
        handleGesture();
    }, { passive: true });
    
    function handleGesture() {
        const deltaX = touchStartX - touchEndX;
        const deltaY = touchStartY - touchEndY;
        const minSwipeDistance = 50;
        
        // Horizontal swipe detection
        if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > minSwipeDistance) {
            if (deltaX > 0) {
                // Swipe left
                handleSwipeLeft();
            } else {
                // Swipe right
                handleSwipeRight();
            }
        }
    }
    
    function handleSwipeLeft() {
        // Handle left swipe (e.g., next image in gallery)
        const lightbox = document.querySelector('.lightbox-overlay');
        if (lightbox) {
            // Navigate to next image in lightbox
            navigateLightbox('next');
        }
    }
    
    function handleSwipeRight() {
        // Handle right swipe (e.g., previous image in gallery)
        const lightbox = document.querySelector('.lightbox-overlay');
        if (lightbox) {
            // Navigate to previous image in lightbox
            navigateLightbox('prev');
        }
    }
}

// Mobile navigation
function initMobileNavigation() {
    const mobileToggle = document.querySelector('.mobile-menu-toggle');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');
    
    if (mobileToggle && navMenu) {
        // Toggle mobile menu
        mobileToggle.addEventListener('click', function() {
            navMenu.classList.toggle('active');
            this.classList.toggle('active');
            
            // Prevent body scroll when menu is open
            if (navMenu.classList.contains('active')) {
                document.body.style.overflow = 'hidden';
            } else {
                document.body.style.overflow = '';
            }
        });
        
        // Close menu when clicking nav links
        navLinks.forEach(link => {
            link.addEventListener('click', function() {
                navMenu.classList.remove('active');
                mobileToggle.classList.remove('active');
                document.body.style.overflow = '';
            });
        });
        
        // Close menu when clicking outside
        document.addEventListener('click', function(e) {
            if (!mobileToggle.contains(e.target) && !navMenu.contains(e.target)) {
                navMenu.classList.remove('active');
                mobileToggle.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
        
        // Close menu on escape key
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && navMenu.classList.contains('active')) {
                navMenu.classList.remove('active');
                mobileToggle.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
    }
}

// Mobile contact optimization
function initMobileContact() {
    // Optimize phone links for mobile
    const phoneLinks = document.querySelectorAll('[data-phone]');
    phoneLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            // On mobile, ensure proper tel: link behavior
            const phoneNumber = this.getAttribute('data-phone');
            
            // Track mobile phone click
            if (typeof gtag !== 'undefined') {
                gtag('event', 'mobile_phone_click', {
                    event_category: 'Mobile',
                    event_label: phoneNumber
                });
            }
        });
    });
    
    // Optimize WhatsApp links for mobile
    const whatsappLinks = document.querySelectorAll('[data-whatsapp]');
    whatsappLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            // On mobile, ensure WhatsApp opens properly
            const phoneNumber = this.getAttribute('data-whatsapp');
            const message = this.getAttribute('data-message') || 'Hello! I am interested in your glass fitting services.';
            
            const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
            
            // Track mobile WhatsApp click
            if (typeof gtag !== 'undefined') {
                gtag('event', 'mobile_whatsapp_click', {
                    event_category: 'Mobile',
                    event_label: phoneNumber
                });
            }
        });
    });
    
    // Optimize contact form for mobile
    optimizeContactFormForMobile();
}

// Optimize contact form for mobile
function optimizeContactFormForMobile() {
    const forms = document.querySelectorAll('.contact-form, #contact-form');
    
    forms.forEach(form => {
        const inputs = form.querySelectorAll('input, textarea');
        
        inputs.forEach(input => {
            // Add mobile-specific input types
            if (input.type === 'tel') {
                input.type = 'tel';
                input.inputMode = 'tel';
            } else if (input.name === 'email') {
                input.type = 'email';
                input.inputMode = 'email';
            } else if (input.name === 'name') {
                input.autocapitalize = 'words';
            } else if (input.name === 'message') {
                input.inputMode = 'text';
            }
            
            // Add mobile-specific attributes
            input.setAttribute('autocomplete', 'on');
            input.setAttribute('autocorrect', 'off');
            input.setAttribute('autocapitalize', 'sentences');
        });
    });
}

// Mobile performance optimizations
function initMobilePerformance() {
    // Lazy load images
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver(function(entries) {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    if (img.dataset.src) {
                        img.src = img.dataset.src;
                        img.classList.remove('lazy');
                        imageObserver.unobserve(img);
                    }
                }
            });
        });
        
        const lazyImages = document.querySelectorAll('img[data-src]');
        lazyImages.forEach(img => imageObserver.observe(img));
    }
    
    // Optimize scroll performance
    let ticking = false;
    
    function updateScrollElements() {
        // Update scroll-based elements here
        ticking = false;
    }
    
    function requestScrollUpdate() {
        if (!ticking) {
            requestAnimationFrame(updateScrollElements);
            ticking = true;
        }
    }
    
    window.addEventListener('scroll', requestScrollUpdate, { passive: true });
    
    // Defer non-critical JavaScript
    deferNonCriticalScripts();
}

// Defer non-critical scripts
function deferNonCriticalScripts() {
    const nonCriticalScripts = [
        'js/gallery.js',
        'js/contact.js'
    ];
    
    nonCriticalScripts.forEach(scriptSrc => {
        const script = document.createElement('script');
        script.src = scriptSrc;
        script.defer = true;
        document.head.appendChild(script);
    });
}

// Mobile-specific utilities
function initMobileUtilities() {
    // Add to home screen prompt
    initAddToHomeScreen();
    
    // Safe area insets for notched devices
    initSafeAreaInsets();
    
    // Mobile-specific CSS variables
    initMobileCSSVariables();
}

// Add to home screen functionality
function initAddToHomeScreen() {
    let deferredPrompt;
    
    window.addEventListener('beforeinstallprompt', function(e) {
        e.preventDefault();
        deferredPrompt = e;
        
        // Show custom install button
        showInstallButton();
    });
    
    function showInstallButton() {
        // Create install button
        const installButton = document.createElement('button');
        installButton.className = 'install-app-btn';
        installButton.innerHTML = '📱 Install App';
        installButton.style.cssText = `
            position: fixed;
            bottom: 20px;
            right: 20px;
            background: var(--primary-blue);
            color: white;
            border: none;
            padding: 12px 20px;
            border-radius: 25px;
            font-size: 14px;
            font-weight: 600;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
            z-index: 1000;
            cursor: pointer;
            transition: transform 0.3s ease;
        `;
        
        installButton.addEventListener('click', function() {
            if (deferredPrompt) {
                deferredPrompt.prompt();
                deferredPrompt.userChoice.then(function(choiceResult) {
                    if (choiceResult.outcome === 'accepted') {
                        console.log('User accepted the install prompt');
                    }
                    deferredPrompt = null;
                    installButton.remove();
                });
            }
        });
        
        document.body.appendChild(installButton);
        
        // Hide button after 10 seconds
        setTimeout(() => {
            if (installButton.parentNode) {
                installButton.remove();
            }
        }, 10000);
    }
}

// Safe area insets for notched devices
function initSafeAreaInsets() {
    const style = document.createElement('style');
    style.textContent = `
        :root {
            --safe-area-inset-top: env(safe-area-inset-top);
            --safe-area-inset-right: env(safe-area-inset-right);
            --safe-area-inset-bottom: env(safe-area-inset-bottom);
            --safe-area-inset-left: env(safe-area-inset-left);
        }
        
        .mobile-device .header {
            padding-top: calc(1rem + var(--safe-area-inset-top));
        }
        
        .mobile-device .footer {
            padding-bottom: calc(1rem + var(--safe-area-inset-bottom));
        }
    `;
    document.head.appendChild(style);
}

// Mobile-specific CSS variables
function initMobileCSSVariables() {
    const style = document.createElement('style');
    style.textContent = `
        :root {
            --mobile-font-size: 16px;
            --mobile-button-size: 44px;
            --mobile-spacing: 1rem;
        }
        
        .mobile-device {
            font-size: var(--mobile-font-size);
        }
        
        .mobile-device .btn {
            min-height: var(--mobile-button-size);
            padding: 0.875rem 1.5rem;
        }
        
        .mobile-device .service-card,
        .mobile-device .gallery-item {
            margin-bottom: var(--mobile-spacing);
        }
        
        @media (max-width: 480px) {
            :root {
                --mobile-font-size: 14px;
                --mobile-button-size: 48px;
                --mobile-spacing: 0.75rem;
            }
        }
    `;
    document.head.appendChild(style);
}

// Mobile orientation handling
function initMobileOrientation() {
    function handleOrientationChange() {
        // Close mobile menu on orientation change
        const navMenu = document.querySelector('.nav-menu');
        const mobileToggle = document.querySelector('.mobile-menu-toggle');
        
        if (navMenu && navMenu.classList.contains('active')) {
            navMenu.classList.remove('active');
            mobileToggle.classList.remove('active');
            document.body.style.overflow = '';
        }
        
        // Close lightbox on orientation change
        const lightbox = document.querySelector('.lightbox-overlay');
        if (lightbox) {
            lightbox.remove();
        }
    }
    
    window.addEventListener('orientationchange', function() {
        setTimeout(handleOrientationChange, 500); // Delay to allow orientation change
    });
}

// Initialize mobile orientation handling
document.addEventListener('DOMContentLoaded', function() {
    initMobileOrientation();
});

// Mobile analytics
function trackMobileEvent(eventName, eventData) {
    if (typeof gtag !== 'undefined') {
        gtag('event', eventName, {
            event_category: 'Mobile',
            ...eventData
        });
    }
}

// Track mobile-specific events
document.addEventListener('touchstart', function(e) {
    // Track touch events for analytics
    const target = e.target;
    
    if (target.closest('.btn-primary')) {
        trackMobileEvent('mobile_button_touch', {
            button_type: 'primary'
        });
    } else if (target.closest('.btn-whatsapp')) {
        trackMobileEvent('mobile_button_touch', {
            button_type: 'whatsapp'
        });
    } else if (target.closest('.gallery-item')) {
        trackMobileEvent('mobile_gallery_touch', {
            item_type: 'gallery'
        });
    }
}, { passive: true });

// Service Worker registration for mobile
if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
        navigator.serviceWorker.register('/sw.js')
            .then(function(registration) {
                console.log('Service Worker registered for mobile');
                trackMobileEvent('service_worker_registered', {
                    scope: registration.scope
                });
            })
            .catch(function(error) {
                console.log('Service Worker registration failed');
            });
    });
}

// Mobile error handling
window.addEventListener('error', function(e) {
    if (/Android|iPhone|iPad|iPod/i.test(navigator.userAgent)) {
        // Track mobile-specific errors
        trackMobileEvent('mobile_error', {
            error_message: e.message,
            error_filename: e.filename,
            error_line: e.lineno
        });
    }
});

// Export mobile functions for testing
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        initMobileOptimizations,
        initTouchGestures,
        initMobileNavigation,
        trackMobileEvent
    };
}