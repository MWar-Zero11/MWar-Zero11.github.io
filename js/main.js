// main.js
document.addEventListener('DOMContentLoaded', function() {
    // Mobile Menu Toggle
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const nav = document.querySelector('nav');
    
    if (mobileMenuToggle) {
        mobileMenuToggle.addEventListener('click', function() {
            nav.classList.toggle('active');
        });
    }
      // Load Vimeo thumbnails for portfolio items
    function loadVimeoThumbnails() {
        const portfolioItems = document.querySelectorAll('.portfolio-item');
        portfolioItems.forEach(item => {
            const vimeoId = item.getAttribute('data-vimeo-id');
            const thumbnailImg = item.querySelector('.portfolio-thumbnail');
            
            // Make sure there are no iframes in the portfolio item that might have been added accidentally
            const existingIframes = item.querySelectorAll('iframe');
            if (existingIframes.length > 0) {
                existingIframes.forEach(iframe => iframe.remove());
            }
            
            if (vimeoId && thumbnailImg) {
                // Try to use the Vimeo API to get thumbnail
                fetch(`https://vimeo.com/api/oembed.json?url=https://vimeo.com/${vimeoId}`)
                    .then(response => response.json())
                    .then(data => {
                        if (data && data.thumbnail_url) {
                            thumbnailImg.src = data.thumbnail_url;
                        }
                    })
                    .catch(error => {
                        console.log('Error loading Vimeo thumbnail:', error);
                        // Try direct approach as fallback
                        thumbnailImg.src = `https://i.vimeocdn.com/video/${vimeoId}_640.jpg`;
                    });
            }
        });
    }
    
    // Load thumbnails
    loadVimeoThumbnails();
    
    // Navigation Highlight on Scroll
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('nav ul li a');
    
    function highlightNavOnScroll() {
        const scrollPosition = window.scrollY + 100;
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');
            
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === '#' + sectionId) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }
    
    window.addEventListener('scroll', highlightNavOnScroll);
    
    // Portfolio Filtering
    const filterButtons = document.querySelectorAll('.filter-btn');
    const portfolioItems = document.querySelectorAll('.portfolio-item');
    
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Update active button
            filterButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            
            // Filter portfolio items
            const filterValue = this.getAttribute('data-filter');
            
            portfolioItems.forEach(item => {
                if (filterValue === 'all' || item.classList.contains(filterValue)) {
                    item.style.display = 'block';
                } else {
                    item.style.display = 'none';
                }
            });
        });
    });
    
    // Project Modal Functionality
    const modal = document.getElementById('project-modal');
    const modalClose = document.querySelector('.modal-close');
    const modalVideoContainer = document.querySelector('.modal-video-container');
    const modalTitle = document.getElementById('modal-title');
    const modalDescription = document.getElementById('modal-description');
    const modalCategory = document.getElementById('modal-category');
    
    // Open modal when clicking on portfolio item
    portfolioItems.forEach(item => {        // Add click event specifically to the view project overlay
        const viewProjectOverlay = item.querySelector('.view-project-overlay');
        if (viewProjectOverlay) {
            viewProjectOverlay.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation(); // Prevent double triggering
                openProjectModal(item);
            });
            
            // Also add click event to the span inside view project overlay
            const viewProjectSpan = viewProjectOverlay.querySelector('span');
            if (viewProjectSpan) {
                viewProjectSpan.addEventListener('click', function(e) {
                    e.preventDefault();
                    e.stopPropagation(); // Prevent event from bubbling up
                    openProjectModal(item);
                });
            }
        }
        
        // Add click event to the play indicator button
        const playIndicator = item.querySelector('.play-indicator');
        if (playIndicator) {
            playIndicator.addEventListener('click', function(e) {
                e.stopPropagation();
                openProjectModal(item);
            });
        }
          // Also add click to the item itself as a fallback, but be more selective
        item.addEventListener('click', function(e) {
            // Only open modal if not clicking on another interactive element
            // and not clicking on the thumbnail or play indicator (those have their own handlers)
            if (!e.target.closest('iframe') && 
                !e.target.closest('.play-indicator') && 
                !e.target.closest('.view-project-overlay') &&
                !e.target.classList.contains('portfolio-thumbnail')) {
                openProjectModal(this);
            }
        });
    });    function openProjectModal(item) {
        // Get project data from data attributes
        const vimeoId = item.getAttribute('data-vimeo-id');
        const title = item.getAttribute('data-title');
        const description = item.getAttribute('data-description');
        const category = item.getAttribute('data-category');
        
        // First show the modal without video
        modal.style.display = 'block';
        modalTitle.textContent = title;
        modalDescription.textContent = description;
        modalCategory.textContent = category;
        
        // Add class to show the modal with transition
        setTimeout(() => {
            modal.classList.add('show');
            
            // Only after the modal is visible, add the iframe to prevent it from appearing elsewhere
            setTimeout(() => {
                modalVideoContainer.innerHTML = `<iframe src="https://player.vimeo.com/video/${vimeoId}?autoplay=1" frameborder="0" allow="autoplay; fullscreen" allowfullscreen></iframe>`;
            }, 200);
        }, 10);
        
        // Prevent scrolling on the body
        document.body.style.overflow = 'hidden';
        
        // Show modal
        modal.style.display = 'block';
        setTimeout(() => {
            modal.classList.add('show');
        }, 10);
        
        // Prevent scrolling on the body
        document.body.style.overflow = 'hidden';
    }
    
    // Close modal when clicking on X
    modalClose.addEventListener('click', closeModal);
    
    // Close modal when clicking outside of modal content
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            closeModal();
        }
    });
    
    // Close modal when pressing ESC key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && modal.classList.contains('show')) {
            closeModal();
        }
    });
      function closeModal() {
        modal.classList.remove('show');
        
        // Immediately clear video iframe to stop playback
        modalVideoContainer.innerHTML = '';
        
        setTimeout(() => {
            modal.style.display = 'none';
        }, 300);
        
        // Re-enable scrolling
        document.body.style.overflow = 'auto';
    }
    
    // Smooth Scrolling for Navigation Links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            
            // Close mobile menu if open
            if (nav.classList.contains('active')) {
                nav.classList.remove('active');
            }
            
            // Scroll to section
            const targetId = this.getAttribute('href');
            if (targetId !== '#') {
                const targetSection = document.querySelector(targetId);
                if (targetSection) {
                    window.scrollTo({
                        top: targetSection.offsetTop,
                        behavior: 'smooth'
                    });
                }
            }
        });
    });
    
    // Header Scroll Effect
    const header = document.querySelector('header');
    let lastScrollTop = 0;
    
    window.addEventListener('scroll', function() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        if (scrollTop > 100) {
            header.style.background = 'rgba(255, 255, 255, 0.98)';
            header.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)';
        } else {
            header.style.background = 'rgba(255, 255, 255, 0.95)';
            header.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.05)';
        }
        
        lastScrollTop = scrollTop;
    });
    
    // Simple Testimonial Slider
    let currentTestimonial = 0;
    const testimonials = document.querySelectorAll('.testimonial-slide');
    
    // Only run testimonial slider if testimonials exist
    if (testimonials && testimonials.length > 1) {
        // Hide all but the first testimonial
        testimonials.forEach((testimonial, index) => {
            if (index !== 0) {
                testimonial.style.display = 'none';
            }
        });
        
        // Automatically cycle through testimonials
        setInterval(() => {
            testimonials[currentTestimonial].style.display = 'none';
            currentTestimonial = (currentTestimonial + 1) % testimonials.length;
            testimonials[currentTestimonial].style.display = 'block';
        }, 6000);
    }
    
    // Form Submission
    const contactForm = document.getElementById('project-inquiry');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            // Check if we need to use our fallback handler
            const isFormSubmit = this.getAttribute('action').indexOf('formsubmit.co') !== -1;
            
            // If using GitHub Pages and FormSubmit
            if (isFormSubmit) {
                // Let FormSubmit handle it (default behavior)
                console.log('Using FormSubmit for form handling');
                
                // Add tracking for successful submission (optional)
                localStorage.setItem('form_submitted', 'true');
                localStorage.setItem('form_submitted_time', new Date().toISOString());
            } else {
                // Fallback for when FormSubmit is not being used
                e.preventDefault();
                
                // Collect form data
                const formData = {
                    name: document.getElementById('name').value || '',
                    email: document.getElementById('email').value || '',
                    message: document.getElementById('message').value || ''
                };
                
                // Log the form data (for debugging purposes)
                console.log('Form data:', formData);
                
                // Clear form
                this.reset();
                
                // Show success message
                alert('Thanks for your message! I\'ll get back to you soon.');
            }
        });
    }
    
    // Unmute Vimeo hero reel
    const unmuteBtn = document.getElementById('unmute-hero-reel');
    const unmuteIcon = document.getElementById('unmute-hero-reel-icon');
    const heroReel = document.getElementById('hero-reel');
    let vimeoPlayer;
    
    function ensureVimeoPlayerLoaded(callback) {
        if (window.Vimeo && window.Vimeo.Player) {
            callback();
        } else {
            const script = document.createElement('script');
            script.src = 'https://player.vimeo.com/api/player.js';
            script.onload = callback;
            document.head.appendChild(script);
        }
    }
    
    if (unmuteBtn && heroReel) {
        ensureVimeoPlayerLoaded(function() {
            vimeoPlayer = new window.Vimeo.Player(heroReel);
            unmuteBtn.addEventListener('click', function() {
                vimeoPlayer.getVolume().then(function(volume) {
                    if (volume === 0) {
                        vimeoPlayer.setVolume(1);
                        unmuteIcon.classList.remove('fa-volume-mute');
                        unmuteIcon.classList.add('fa-volume-up');
                    } else {
                        vimeoPlayer.setVolume(0);
                        unmuteIcon.classList.remove('fa-volume-up');
                        unmuteIcon.classList.add('fa-volume-mute');
                    }
                });
            });
        });
    }
});

// Add a loading animation for videos
window.addEventListener('load', function() {
    // This would trigger when all resources are loaded
    document.body.classList.add('loaded');
});
