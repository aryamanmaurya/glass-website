// Gallery functionality for Portfolio page

document.addEventListener('DOMContentLoaded', function() {
    initGalleryFiltering();
    initLightbox();
    initImageLazyLoading();
    initGallerySearch();
});

// Gallery filtering functionality
function initGalleryFiltering() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const galleryItems = document.querySelectorAll('.gallery-item');
    
    if (filterButtons.length === 0 || galleryItems.length === 0) {
        return; // Exit if no gallery elements found
    }
    
    // Add click event listeners to filter buttons
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            const filter = this.getAttribute('data-filter');
            
            // Update active button
            filterButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            
            // Filter gallery items with animation
            filterGalleryItems(filter, galleryItems);
            
            // Update URL without page reload (for bookmarking)
            updateURL(filter);
            
            // Track filter usage
            trackGalleryFilter(filter);
        });
    });
    
    // Check URL for filter parameter on page load
    const urlParams = new URLSearchParams(window.location.search);
    const filterFromURL = urlParams.get('filter');
    if (filterFromURL) {
        const targetButton = document.querySelector(`[data-filter="${filterFromURL}"]`);
        if (targetButton) {
            targetButton.click();
        }
    }
}

// Filter gallery items with smooth animation
function filterGalleryItems(filter, galleryItems) {
    let visibleCount = 0;
    
    galleryItems.forEach((item, index) => {
        const category = item.getAttribute('data-category');
        const shouldShow = filter === 'all' || category === filter;
        
        if (shouldShow) {
            // Show item with staggered animation
            setTimeout(() => {
                item.style.display = 'block';
                item.style.opacity = '0';
                item.style.transform = 'translateY(20px)';
                
                requestAnimationFrame(() => {
                    item.style.transition = 'all 0.4s ease';
                    item.style.opacity = '1';
                    item.style.transform = 'translateY(0)';
                });
            }, index * 50); // Stagger animation by 50ms
            
            visibleCount++;
        } else {
            // Hide item
            item.style.transition = 'all 0.3s ease';
            item.style.opacity = '0';
            item.style.transform = 'translateY(-20px)';
            
            setTimeout(() => {
                item.style.display = 'none';
            }, 300);
        }
    });
    
    // Update gallery stats
    updateGalleryStats(filter, visibleCount);
}

// Update gallery statistics display
function updateGalleryStats(filter, visibleCount) {
    const statsElement = document.querySelector('.gallery-stats');
    if (statsElement) {
        const filterName = filter === 'all' ? 'All Work' : getFilterDisplayName(filter);
        statsElement.textContent = `Showing ${visibleCount} ${filterName} projects`;
    }
}

// Get display name for filter
function getFilterDisplayName(filter) {
    const filterNames = {
        'windows': 'Window',
        'shower': 'Shower Door',
        'storefront': 'Storefront',
        'mirrors': 'Mirror',
        'repairs': 'Repair',
        'emergency': 'Emergency Service'
    };
    return filterNames[filter] || filter;
}

// Update URL for filter state
function updateURL(filter) {
    const url = new URL(window.location);
    if (filter === 'all') {
        url.searchParams.delete('filter');
    } else {
        url.searchParams.set('filter', filter);
    }
    window.history.replaceState({}, '', url);
}

// Track gallery filter usage
function trackGalleryFilter(filter) {
    // Analytics tracking
    if (typeof gtag !== 'undefined') {
        gtag('event', 'gallery_filter', {
            event_category: 'Gallery',
            event_label: filter
        });
    }
}

// Lightbox functionality
function initLightbox() {
    const galleryItems = document.querySelectorAll('.gallery-item');
    
    galleryItems.forEach(item => {
        item.addEventListener('click', function() {
            const img = this.querySelector('img');
            const title = this.querySelector('.gallery-overlay h3')?.textContent || '';
            const description = this.querySelector('.gallery-overlay p')?.textContent || '';
            
            openLightbox(img.src, title, description);
        });
    });
}

// Open lightbox with image
function openLightbox(imageSrc, title, description) {
    // Create lightbox overlay
    const lightbox = document.createElement('div');
    lightbox.className = 'lightbox-overlay';
    lightbox.innerHTML = `
        <div class="lightbox-content">
            <button class="lightbox-close">&times;</button>
            <img class="lightbox-image" src="${imageSrc}" alt="${title}">
            <div class="lightbox-info">
                <h3 class="lightbox-title">${title}</h3>
                <p class="lightbox-description">${description}</p>
            </div>
            <div class="lightbox-navigation">
                <button class="lightbox-prev">&#8249;</button>
                <button class="lightbox-next">&#8250;</button>
            </div>
        </div>
    `;
    
    // Add lightbox styles
    const lightboxStyles = `
        .lightbox-overlay {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.9);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 10000;
            opacity: 0;
            transition: opacity 0.3s ease;
        }
        
        .lightbox-overlay.active {
            opacity: 1;
        }
        
        .lightbox-content {
            position: relative;
            max-width: 90vw;
            max-height: 90vh;
            display: flex;
            flex-direction: column;
            align-items: center;
        }
        
        .lightbox-image {
            max-width: 100%;
            max-height: 80vh;
            object-fit: contain;
            border-radius: 0.5rem;
        }
        
        .lightbox-close {
            position: absolute;
            top: -40px;
            right: 0;
            background: none;
            border: none;
            color: white;
            font-size: 2rem;
            cursor: pointer;
            width: 40px;
            height: 40px;
            display: flex;
            align-items: center;
            justify-content: center;
            border-radius: 50%;
            background: rgba(255, 255, 255, 0.1);
            transition: background 0.3s ease;
        }
        
        .lightbox-close:hover {
            background: rgba(255, 255, 255, 0.2);
        }
        
        .lightbox-info {
            text-align: center;
            color: white;
            margin-top: 1rem;
            max-width: 600px;
        }
        
        .lightbox-title {
            color: white;
            margin-bottom: 0.5rem;
        }
        
        .lightbox-description {
            color: rgba(255, 255, 255, 0.8);
            margin: 0;
        }
        
        .lightbox-navigation {
            position: absolute;
            top: 50%;
            width: 100%;
            display: flex;
            justify-content: space-between;
            pointer-events: none;
        }
        
        .lightbox-prev,
        .lightbox-next {
            background: rgba(255, 255, 255, 0.1);
            border: none;
            color: white;
            font-size: 2rem;
            width: 50px;
            height: 50px;
            border-radius: 50%;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: background 0.3s ease;
            pointer-events: all;
        }
        
        .lightbox-prev {
            left: -60px;
        }
        
        .lightbox-next {
            right: -60px;
        }
        
        .lightbox-prev:hover,
        .lightbox-next:hover {
            background: rgba(255, 255, 255, 0.2);
        }
        
        @media (max-width: 768px) {
            .lightbox-prev {
                left: 10px;
            }
            
            .lightbox-next {
                right: 10px;
            }
            
            .lightbox-close {
                top: 10px;
                right: 10px;
            }
        }
    `;
    
    // Add styles to head if not already added
    if (!document.querySelector('#lightbox-styles')) {
        const styleSheet = document.createElement('style');
        styleSheet.id = 'lightbox-styles';
        styleSheet.textContent = lightboxStyles;
        document.head.appendChild(styleSheet);
    }
    
    // Add lightbox to page
    document.body.appendChild(lightbox);
    
    // Animate in
    requestAnimationFrame(() => {
        lightbox.classList.add('active');
    });
    
    // Close functionality
    const closeBtn = lightbox.querySelector('.lightbox-close');
    closeBtn.addEventListener('click', closeLightbox);
    
    lightbox.addEventListener('click', function(e) {
        if (e.target === lightbox) {
            closeLightbox();
        }
    });
    
    // Keyboard navigation
    const handleKeydown = function(e) {
        switch(e.key) {
            case 'Escape':
                closeLightbox();
                break;
            case 'ArrowLeft':
                navigateLightbox('prev');
                break;
            case 'ArrowRight':
                navigateLightbox('next');
                break;
        }
    };
    
    document.addEventListener('keydown', handleKeydown);
    
    // Store reference for navigation
    lightbox.handleKeydown = handleKeydown;
    
    function closeLightbox() {
        lightbox.classList.remove('active');
        document.removeEventListener('keydown', handleKeydown);
        
        setTimeout(() => {
            document.body.removeChild(lightbox);
        }, 300);
    }
    
    function navigateLightbox(direction) {
        // Implementation for next/previous navigation
        // This would require storing current image index
        console.log(`Navigate ${direction}`);
    }
}

// Lazy loading for gallery images
function initImageLazyLoading() {
    const images = document.querySelectorAll('.gallery-item img');
    
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver(function(entries, observer) {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.classList.add('loaded');
                    observer.unobserve(img);
                }
            });
        });
        
        images.forEach(img => {
            img.classList.add('lazy');
            imageObserver.observe(img);
        });
    } else {
        // Fallback for older browsers
        images.forEach(img => img.classList.add('loaded'));
    }
}

// Gallery search functionality
function initGallerySearch() {
    const searchInput = document.querySelector('.gallery-search');
    
    if (searchInput) {
        let searchTimeout;
        
        searchInput.addEventListener('input', function() {
            clearTimeout(searchTimeout);
            searchTimeout = setTimeout(() => {
                searchGallery(this.value);
            }, 300);
        });
    }
}

// Search through gallery items
function searchGallery(searchTerm) {
    const galleryItems = document.querySelectorAll('.gallery-item');
    const term = searchTerm.toLowerCase().trim();
    
    galleryItems.forEach(item => {
        const title = item.querySelector('.gallery-overlay h3')?.textContent.toLowerCase() || '';
        const description = item.querySelector('.gallery-overlay p')?.textContent.toLowerCase() || '';
        const altText = item.querySelector('img')?.alt.toLowerCase() || '';
        
        const matches = title.includes(term) || description.includes(term) || altText.includes(term);
        
        if (matches || term === '') {
            item.style.display = 'block';
            item.style.animation = 'fadeIn 0.3s ease-in-out';
        } else {
            item.style.display = 'none';
        }
    });
    
    // Update visible count
    const visibleItems = Array.from(galleryItems).filter(item => item.style.display !== 'none');
    const statsElement = document.querySelector('.gallery-stats');
    if (statsElement) {
        const count = visibleItems.length;
        const searchText = term ? ` matching "${searchTerm}"` : '';
        statsElement.textContent = `Showing ${count} projects${searchText}`;
    }
}

// Gallery statistics
function updateGalleryStats() {
    const galleryItems = document.querySelectorAll('.gallery-item');
    const totalCount = galleryItems.length;
    
    // Count items by category
    const categoryCounts = {};
    galleryItems.forEach(item => {
        const category = item.getAttribute('data-category');
        categoryCounts[category] = (categoryCounts[category] || 0) + 1;
    });
    
    // Update any stats displays
    const statsElement = document.querySelector('.gallery-stats');
    if (statsElement) {
        statsElement.textContent = `Total: ${totalCount} projects`;
    }
    
    return categoryCounts;
}

// Initialize gallery stats on load
document.addEventListener('DOMContentLoaded', function() {
    updateGalleryStats();
});

// Touch gestures for mobile lightbox
function initTouchGestures() {
    let touchStartX = 0;
    let touchStartY = 0;
    
    document.addEventListener('touchstart', function(e) {
        touchStartX = e.touches[0].clientX;
        touchStartY = e.touches[0].clientY;
    });
    
    document.addEventListener('touchend', function(e) {
        const touchEndX = e.changedTouches[0].clientX;
        const touchEndY = e.changedTouches[0].clientY;
        const diffX = touchStartX - touchEndX;
        const diffY = touchStartY - touchEndY;
        
        // Only process horizontal swipes
        if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 50) {
            const lightbox = document.querySelector('.lightbox-overlay');
            if (lightbox) {
                if (diffX > 0) {
                    // Swipe left - next image
                    navigateLightbox('next');
                } else {
                    // Swipe right - previous image
                    navigateLightbox('prev');
                }
            }
        }
    });
}

// Initialize touch gestures
document.addEventListener('DOMContentLoaded', function() {
    initTouchGestures();
});