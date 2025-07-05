// Carousel functionality for the guest house website

class Carousel {
    constructor(element) {
        this.carousel = element;
        this.track = element.querySelector('.carousel-track');
        this.slides = element.querySelectorAll('.carousel-slide');
        this.nextBtn = element.querySelector('.carousel-next');
        this.prevBtn = element.querySelector('.carousel-prev');
        this.indicators = element.querySelectorAll('.indicator');
        
        this.currentSlide = 0;
        this.slideCount = this.slides.length;
        this.isTransitioning = false;
        this.autoplayInterval = null;
        this.autoplayDelay = 5000; // 5 seconds
        
        this.init();
    }
    
    init() {
        if (this.slideCount === 0) return;
        
        this.setupEventListeners();
        this.setupAutoplay();
        this.setupKeyboardNavigation();
        this.setupTouchNavigation();
        
        // Set initial state
        this.updateSlide(0, false);
        
        console.log('Carousel initialized with', this.slideCount, 'slides');
    }
    
    setupEventListeners() {
        // Navigation buttons
        if (this.nextBtn) {
            this.nextBtn.addEventListener('click', () => this.nextSlide());
        }
        
        if (this.prevBtn) {
            this.prevBtn.addEventListener('click', () => this.prevSlide());
        }
        
        // Indicators
        this.indicators.forEach((indicator, index) => {
            indicator.addEventListener('click', () => this.goToSlide(index));
        });
        
        // Pause autoplay on hover
        this.carousel.addEventListener('mouseenter', () => this.pauseAutoplay());
        this.carousel.addEventListener('mouseleave', () => this.resumeAutoplay());
        
        // Pause autoplay when tab is not visible
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                this.pauseAutoplay();
            } else {
                this.resumeAutoplay();
            }
        });
    }
    
    setupAutoplay() {
        this.autoplayInterval = setInterval(() => {
            if (!this.isTransitioning) {
                this.nextSlide();
            }
        }, this.autoplayDelay);
    }
    
    pauseAutoplay() {
        if (this.autoplayInterval) {
            clearInterval(this.autoplayInterval);
            this.autoplayInterval = null;
        }
    }
    
    resumeAutoplay() {
        if (!this.autoplayInterval) {
            this.setupAutoplay();
        }
    }
    
    setupKeyboardNavigation() {
        document.addEventListener('keydown', (e) => {
            if (!this.carousel.matches(':hover')) return;
            
            switch (e.key) {
                case 'ArrowLeft':
                    e.preventDefault();
                    this.prevSlide();
                    break;
                case 'ArrowRight':
                    e.preventDefault();
                    this.nextSlide();
                    break;
                case ' ':
                    e.preventDefault();
                    if (this.autoplayInterval) {
                        this.pauseAutoplay();
                    } else {
                        this.resumeAutoplay();
                    }
                    break;
            }
        });
    }
    
    setupTouchNavigation() {
        let startX = 0;
        let endX = 0;
        let startY = 0;
        let endY = 0;
        
        this.carousel.addEventListener('touchstart', (e) => {
            startX = e.touches[0].clientX;
            startY = e.touches[0].clientY;
        });
        
        this.carousel.addEventListener('touchend', (e) => {
            endX = e.changedTouches[0].clientX;
            endY = e.changedTouches[0].clientY;
            
            const deltaX = endX - startX;
            const deltaY = endY - startY;
            
            // Only trigger if horizontal swipe is more significant than vertical
            if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 50) {
                if (deltaX > 0) {
                    this.prevSlide();
                } else {
                    this.nextSlide();
                }
            }
        });
    }
    
    nextSlide() {
        if (this.isTransitioning) return;
        
        const next = (this.currentSlide + 1) % this.slideCount;
        this.updateSlide(next, true, 'right');
    }
    
    prevSlide() {
        if (this.isTransitioning) return;
        
        const prev = (this.currentSlide - 1 + this.slideCount) % this.slideCount;
        this.updateSlide(prev, true, 'left');
    }
    
    goToSlide(index) {
        if (this.isTransitioning || index === this.currentSlide) return;
        
        const direction = index > this.currentSlide ? 'right' : 'left';
        this.updateSlide(index, true, direction);
    }
    
    updateSlide(newIndex, animate = false, direction = 'right') {
        if (this.isTransitioning) return;
        
        const currentSlideElement = this.slides[this.currentSlide];
        const newSlideElement = this.slides[newIndex];
        
        if (animate) {
            this.isTransitioning = true;
            
            // Add animation classes
            currentSlideElement.classList.add('fade-out');
            newSlideElement.classList.add(direction === 'right' ? 'slide-in-right' : 'slide-in-left');
            
            // Transition timeout
            setTimeout(() => {
                this.finishTransition(currentSlideElement, newSlideElement, newIndex);
            }, 600);
        } else {
            this.finishTransition(currentSlideElement, newSlideElement, newIndex);
        }
    }
    
    finishTransition(currentSlideElement, newSlideElement, newIndex) {
        // Remove active class from current slide
        currentSlideElement.classList.remove('active', 'fade-out');
        
        // Remove animation classes
        newSlideElement.classList.remove('slide-in-right', 'slide-in-left');
        
        // Add active class to new slide
        newSlideElement.classList.add('active');
        
        // Update indicators
        this.updateIndicators(newIndex);
        
        // Update current slide index
        this.currentSlide = newIndex;
        this.isTransitioning = false;
        
        // Trigger custom event
        this.carousel.dispatchEvent(new CustomEvent('slideChange', {
            detail: { currentSlide: this.currentSlide }
        }));
    }
    
    updateIndicators(activeIndex) {
        this.indicators.forEach((indicator, index) => {
            indicator.classList.toggle('active', index === activeIndex);
        });
    }
    
    // Public methods
    destroy() {
        this.pauseAutoplay();
        
        // Remove event listeners
        if (this.nextBtn) {
            this.nextBtn.removeEventListener('click', this.nextSlide);
        }
        if (this.prevBtn) {
            this.prevBtn.removeEventListener('click', this.prevSlide);
        }
        
        this.indicators.forEach((indicator, index) => {
            indicator.removeEventListener('click', () => this.goToSlide(index));
        });
    }
    
    play() {
        this.resumeAutoplay();
    }
    
    pause() {
        this.pauseAutoplay();
    }
    
    getCurrentSlide() {
        return this.currentSlide;
    }
    
    getSlideCount() {
        return this.slideCount;
    }
}

// Initialize carousels when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    const carousels = document.querySelectorAll('.carousel');
    const carouselInstances = [];
    
    carousels.forEach(carousel => {
        const instance = new Carousel(carousel);
        carouselInstances.push(instance);
    });
    
    // Store instances globally for access
    window.carouselInstances = carouselInstances;
    
    // Initialize main carousel with special handling
    const mainCarousel = document.getElementById('main-carousel');
    if (mainCarousel) {
        const mainCarouselInstance = carouselInstances.find(instance => 
            instance.carousel === mainCarousel
        );
        
        if (mainCarouselInstance) {
            // Add special event handling for main carousel
            mainCarousel.addEventListener('slideChange', function(e) {
                console.log('Main carousel slide changed to:', e.detail.currentSlide);
                
                // Optional: Add Google Analytics tracking
                if (typeof gtag !== 'undefined') {
                    gtag('event', 'carousel_slide_change', {
                        'slide_index': e.detail.currentSlide
                    });
                }
            });
        }
    }
    
    console.log('Initialized', carouselInstances.length, 'carousel(s)');
});

// Handle carousel responsiveness
window.addEventListener('resize', function() {
    // Update carousel dimensions if needed
    const carousels = document.querySelectorAll('.carousel');
    
    carousels.forEach(carousel => {
        const track = carousel.querySelector('.carousel-track');
        const slides = carousel.querySelectorAll('.carousel-slide');
        
        // Reset any transforms that might have been applied
        if (track) {
            track.style.transform = '';
        }
        
        slides.forEach(slide => {
            slide.style.transform = '';
        });
    });
});

// Intersection Observer for carousel optimization
if ('IntersectionObserver' in window) {
    const carouselObserver = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            const carousel = entry.target;
            const carouselInstance = window.carouselInstances?.find(instance => 
                instance.carousel === carousel
            );
            
            if (carouselInstance) {
                if (entry.isIntersecting) {
                    carouselInstance.play();
                } else {
                    carouselInstance.pause();
                }
            }
        });
    }, {
        threshold: 0.5
    });
    
    // Observe carousels when they're created
    document.addEventListener('DOMContentLoaded', function() {
        const carousels = document.querySelectorAll('.carousel');
        carousels.forEach(carousel => {
            carouselObserver.observe(carousel);
        });
    });
}

// Export for use in other scripts
window.Carousel = Carousel;
