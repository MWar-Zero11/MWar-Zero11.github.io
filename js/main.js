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
    
    if (testimonials.length > 1) {
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
    }    // Form Submission
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
            // If using FormSubmit, let the form submit normally
        });
    }
    
    // Unmute Vimeo hero reel
    var unmuteBtn = document.getElementById('unmute-hero-reel');
    var unmuteIcon = document.getElementById('unmute-hero-reel-icon');
    var heroReel = document.getElementById('hero-reel');
    var vimeoPlayer;
    function ensureVimeoPlayerLoaded(callback) {
        if (window.Vimeo && window.Vimeo.Player) {
            callback();
        } else {
            var script = document.createElement('script');
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
