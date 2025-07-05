// Gallery functionality for the guest house website

class Gallery {
    constructor() {
        this.galleryGrid = document.getElementById('gallery-grid');
        this.gallerySlider = document.getElementById('gallery-slider');
        this.lightbox = document.getElementById('lightbox');
        this.filterButtons = document.querySelectorAll('.filter-btn');
        this.viewButtons = document.querySelectorAll('.view-btn');
        
        this.currentFilter = 'all';
        this.currentView = 'grid';
        this.currentLightboxIndex = 0;
        this.filteredImages = [];
        
        this.init();
    }
    
    init() {
        this.setupFilters();
        this.setupViewToggle();
        this.setupLightbox();
        this.setupSlider();
        this.setupKeyboardNavigation();
        this.collectImages();
        
        console.log('Gallery initialized');
    }
    
    collectImages() {
        this.allImages = Array.from(document.querySelectorAll('.gallery-item'));
        this.updateFilteredImages();
    }
    
    setupFilters() {
        this.filterButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                const category = e.target.dataset.category;
                this.filterGallery(category);
                this.updateFilterButtons(e.target);
            });
        });
    }
    
    filterGallery(category) {
        this.currentFilter = category;
        
        if (!this.galleryGrid) return;
        
        const items = this.galleryGrid.querySelectorAll('.gallery-item');
        
        items.forEach(item => {
            const itemCategory = item.dataset.category;
            const shouldShow = category === 'all' || itemCategory === category;
            
            if (shouldShow) {
                item.classList.remove('filtered');
                item.classList.add('show');
            } else {
                item.classList.add('filtered');
                item.classList.remove('show');
            }
        });
        
        this.updateFilteredImages();
        this.updateSlider();
    }
    
    updateFilteredImages() {
        this.filteredImages = this.allImages.filter(item => {
            const itemCategory = item.dataset.category;
            return this.currentFilter === 'all' || itemCategory === this.currentFilter;
        });
    }
    
    updateFilterButtons(activeButton) {
        this.filterButtons.forEach(button => {
            button.classList.remove('active');
        });
        activeButton.classList.add('active');
    }
    
    setupViewToggle() {
        this.viewButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                const view = e.target.dataset.view;
                this.toggleView(view);
                this.updateViewButtons(e.target);
            });
        });
    }
    
    toggleView(view) {
        this.currentView = view;
        
        if (view === 'grid') {
            this.galleryGrid?.classList.remove('hidden');
            this.gallerySlider?.classList.add('hidden');
        } else {
            this.galleryGrid?.classList.add('hidden');
            this.gallerySlider?.classList.remove('hidden');
            this.updateSlider();
        }
    }
    
    updateViewButtons(activeButton) {
        this.viewButtons.forEach(button => {
            button.classList.remove('active');
        });
        activeButton.classList.add('active');
    }
    
    setupSlider() {
        if (!this.gallerySlider) return;
        
        const sliderTrack = document.getElementById('slider-track');
        const prevBtn = document.getElementById('slider-prev');
        const nextBtn = document.getElementById('slider-next');
        
        if (prevBtn) {
            prevBtn.addEventListener('click', () => this.prevSliderImage());
        }
        
        if (nextBtn) {
            nextBtn.addEventListener('click', () => this.nextSliderImage());
        }
        
        this.currentSliderIndex = 0;
        this.updateSlider();
    }
    
    updateSlider() {
        if (!this.gallerySlider || this.currentView !== 'slider') return;
        
        const sliderTrack = document.getElementById('slider-track');
        const currentSlideSpan = document.getElementById('current-slide');
        const totalSlidesSpan = document.getElementById('total-slides');
        
        if (!sliderTrack) return;
        
        // Clear existing slides
        sliderTrack.innerHTML = '';
        
        // Add filtered images to slider
        this.filteredImages.forEach(item => {
            const slide = document.createElement('div');
            slide.className = 'slider-slide';
            
            const img = item.querySelector('img');
            if (img) {
                const slideImg = document.createElement('img');
                slideImg.src = img.src;
                slideImg.alt = img.alt;
                slide.appendChild(slideImg);
            }
            
            sliderTrack.appendChild(slide);
        });
        
        // Update counter
        if (currentSlideSpan) currentSlideSpan.textContent = this.currentSliderIndex + 1;
        if (totalSlidesSpan) totalSlidesSpan.textContent = this.filteredImages.length;
        
        // Update slider position
        this.updateSliderPosition();
    }
    
    updateSliderPosition() {
        const sliderTrack = document.getElementById('slider-track');
        if (!sliderTrack) return;
        
        const translateX = -this.currentSliderIndex * 100;
        sliderTrack.style.transform = `translateX(${translateX}%)`;
        
        // Update counter
        const currentSlideSpan = document.getElementById('current-slide');
        if (currentSlideSpan) {
            currentSlideSpan.textContent = this.currentSliderIndex + 1;
        }
    }
    
    nextSliderImage() {
        if (this.currentSliderIndex < this.filteredImages.length - 1) {
            this.currentSliderIndex++;
        } else {
            this.currentSliderIndex = 0;
        }
        this.updateSliderPosition();
    }
    
    prevSliderImage() {
        if (this.currentSliderIndex > 0) {
            this.currentSliderIndex--;
        } else {
            this.currentSliderIndex = this.filteredImages.length - 1;
        }
        this.updateSliderPosition();
    }
    
    setupLightbox() {
        if (!this.lightbox) return;
        
        const lightboxImage = document.getElementById('lightbox-image');
        const lightboxClose = document.getElementById('lightbox-close');
        const lightboxPrev = document.getElementById('lightbox-prev');
        const lightboxNext = document.getElementById('lightbox-next');
        
        // Open lightbox when clicking on gallery images
        document.addEventListener('click', (e) => {
            const viewBtn = e.target.closest('.view-btn-overlay');
            if (viewBtn) {
                e.preventDefault();
                const src = viewBtn.dataset.src;
                this.openLightbox(src);
            }
        });
        
        // Close lightbox
        if (lightboxClose) {
            lightboxClose.addEventListener('click', () => this.closeLightbox());
        }
        
        // Close lightbox when clicking on backdrop
        this.lightbox.addEventListener('click', (e) => {
            if (e.target === this.lightbox) {
                this.closeLightbox();
            }
        });
        
        // Navigation
        if (lightboxPrev) {
            lightboxPrev.addEventListener('click', () => this.prevLightboxImage());
        }
        
        if (lightboxNext) {
            lightboxNext.addEventListener('click', () => this.nextLightboxImage());
        }
    }
    
    openLightbox(imageSrc) {
        if (!this.lightbox) return;
        
        const lightboxImage = document.getElementById('lightbox-image');
        
        // Find the index of the current image in filtered images
        this.currentLightboxIndex = this.filteredImages.findIndex(item => {
            const img = item.querySelector('img');
            return img && img.src === imageSrc;
        });
        
        if (this.currentLightboxIndex === -1) {
            this.currentLightboxIndex = 0;
        }
        
        this.updateLightboxImage();
        this.lightbox.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
    
    closeLightbox() {
        if (!this.lightbox) return;
        
        this.lightbox.classList.remove('active');
        document.body.style.overflow = '';
    }
    
    updateLightboxImage() {
        const lightboxImage = document.getElementById('lightbox-image');
        if (!lightboxImage || this.filteredImages.length === 0) return;
        
        const currentItem = this.filteredImages[this.currentLightboxIndex];
        const img = currentItem?.querySelector('img');
        
        if (img) {
            lightboxImage.src = img.src;
            lightboxImage.alt = img.alt;
        }
    }
    
    nextLightboxImage() {
        if (this.filteredImages.length === 0) return;
        
        this.currentLightboxIndex = (this.currentLightboxIndex + 1) % this.filteredImages.length;
        this.updateLightboxImage();
    }
    
    prevLightboxImage() {
        if (this.filteredImages.length === 0) return;
        
        this.currentLightboxIndex = (this.currentLightboxIndex - 1 + this.filteredImages.length) % this.filteredImages.length;
        this.updateLightboxImage();
    }
    
    setupKeyboardNavigation() {
        document.addEventListener('keydown', (e) => {
            if (!this.lightbox?.classList.contains('active')) return;
            
            switch (e.key) {
                case 'Escape':
                    this.closeLightbox();
                    break;
                case 'ArrowLeft':
                    this.prevLightboxImage();
                    break;
                case 'ArrowRight':
                    this.nextLightboxImage();
                    break;
            }
        });
    }
}

// Gallery Masonry Layout (optional enhancement)
class MasonryGallery {
    constructor(container) {
        this.container = container;
        this.items = container.querySelectorAll('.gallery-item');
        this.columnWidth = 300;
        this.gap = 20;
        
        this.init();
    }
    
    init() {
        this.calculateLayout();
        window.addEventListener('resize', () => this.calculateLayout());
    }
    
    calculateLayout() {
        if (window.innerWidth <= 768) return; // Skip masonry on mobile
        
        const containerWidth = this.container.clientWidth;
        const columns = Math.floor(containerWidth / (this.columnWidth + this.gap));
        const columnHeights = new Array(columns).fill(0);
        
        this.items.forEach(item => {
            const shortestColumn = columnHeights.indexOf(Math.min(...columnHeights));
            const x = shortestColumn * (this.columnWidth + this.gap);
            const y = columnHeights[shortestColumn];
            
            item.style.position = 'absolute';
            item.style.left = `${x}px`;
            item.style.top = `${y}px`;
            item.style.width = `${this.columnWidth}px`;
            
            columnHeights[shortestColumn] += item.offsetHeight + this.gap;
        });
        
        const maxHeight = Math.max(...columnHeights);
        this.container.style.height = `${maxHeight}px`;
        this.container.style.position = 'relative';
    }
}

// Image lazy loading for gallery
class GalleryLazyLoader {
    constructor() {
        this.imageObserver = null;
        this.init();
    }
    
    init() {
        if ('IntersectionObserver' in window) {
            this.imageObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        this.loadImage(img);
                        this.imageObserver.unobserve(img);
                    }
                });
            }, {
                rootMargin: '50px'
            });
            
            this.observeImages();
        }
    }
    
    observeImages() {
        const lazyImages = document.querySelectorAll('.gallery-item img[data-src]');
        lazyImages.forEach(img => {
            this.imageObserver.observe(img);
        });
    }
    
    loadImage(img) {
        const src = img.dataset.src;
        if (src) {
            img.src = src;
            img.removeAttribute('data-src');
            img.classList.add('loaded');
        }
    }
}

// Initialize gallery when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Check if we're on the gallery page
    if (document.querySelector('.gallery-section')) {
        const gallery = new Gallery();
        window.galleryInstance = gallery;
        
        // Initialize lazy loading
        const lazyLoader = new GalleryLazyLoader();
        
        // Optional: Initialize masonry layout
        const galleryGrid = document.getElementById('gallery-grid');
        if (galleryGrid && window.innerWidth > 768) {
            const masonry = new MasonryGallery(galleryGrid);
            window.masonryInstance = masonry;
        }
        
        console.log('Gallery page initialized');
    }
});

// Handle gallery responsiveness
window.addEventListener('resize', function() {
    if (window.galleryInstance) {
        // Recalculate layout after resize
        setTimeout(() => {
            window.galleryInstance.updateSlider();
        }, 100);
    }
});

// Export classes for external use
window.Gallery = Gallery;
window.MasonryGallery = MasonryGallery;
window.GalleryLazyLoader = GalleryLazyLoader;
