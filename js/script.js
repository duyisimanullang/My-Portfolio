// ===== MODERN PORTFOLIO JAVASCRIPT ===== //

document.addEventListener('DOMContentLoaded', function() {
    // Initialize all components
    initializeNavigation();
    initializeScrollEffects();
    initializeAnimations();
    initializeSkillBars();
    initializeContactForm();
    initializeScrollToTop();
    initializeLoading();
    initializeMobileMenu();
});

// Navigation functionality
function initializeNavigation() {
    const navbar = document.querySelector('.navbar');
    const navLinks = document.querySelectorAll('.nav-link');
    
    // Navbar scroll effect
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
        
        // Update active nav link based on scroll position
        updateActiveNavLink();
    });
    
    // Smooth scroll for nav links
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                targetSection.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
            
            // Close mobile menu if open
            const mobileMenu = document.querySelector('.mobile-menu');
            const mobileToggle = document.querySelector('.mobile-menu-toggle');
            if (mobileMenu && mobileMenu.classList.contains('active')) {
                mobileMenu.classList.remove('active');
                mobileToggle.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
    });
}

// Update active navigation link based on scroll position
function updateActiveNavLink() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link, .mobile-nav-link');
    
    let currentSection = '';
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop - 100;
        const sectionHeight = section.offsetHeight;
        
        if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
            currentSection = section.getAttribute('id');
        }
    });
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${currentSection}`) {
            link.classList.add('active');
        }
    });
}

// Mobile menu functionality
function initializeMobileMenu() {
    const mobileToggle = document.querySelector('.mobile-menu-toggle');
    const mobileMenu = document.querySelector('.mobile-menu');
    const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');
    
    if (!mobileToggle || !mobileMenu) return;
    
    // Toggle mobile menu
    mobileToggle.addEventListener('click', () => {
        mobileToggle.classList.toggle('active');
        mobileMenu.classList.toggle('active');
        
        // Prevent body scroll when menu is open
        if (mobileMenu.classList.contains('active')) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
    });
    
    // Close menu when clicking on links
    mobileNavLinks.forEach(link => {
        link.addEventListener('click', () => {
            mobileToggle.classList.remove('active');
            mobileMenu.classList.remove('active');
            document.body.style.overflow = '';
        });
    });
    
    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!mobileToggle.contains(e.target) && !mobileMenu.contains(e.target)) {
            mobileToggle.classList.remove('active');
            mobileMenu.classList.remove('active');
            document.body.style.overflow = '';
        }
    });
    
    // Close menu on escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && mobileMenu.classList.contains('active')) {
            mobileToggle.classList.remove('active');
            mobileMenu.classList.remove('active');
            document.body.style.overflow = '';
        }
    });
}

// Scroll effects and animations
function initializeScrollEffects() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);
    
    // Observe all animated elements
    const animatedElements = document.querySelectorAll('.fade-in, .slide-in-left, .slide-in-right');
    animatedElements.forEach(el => observer.observe(el));
}

// Initialize animations
function initializeAnimations() {
    // Add animation classes to elements
    const aboutSection = document.querySelector('.about-content');
    const skillsSection = document.querySelector('.skills-grid');
    const projectsSection = document.querySelector('.projects-grid');
    const timelineItems = document.querySelectorAll('.timeline-item');
    
    if (aboutSection) {
        aboutSection.classList.add('fade-in');
    }
    
    if (skillsSection) {
        skillsSection.classList.add('fade-in');
    }
    
    if (projectsSection) {
        projectsSection.classList.add('fade-in');
    }
    
    timelineItems.forEach((item, index) => {
        item.classList.add('fade-in');
        item.style.animationDelay = `${index * 0.2}s`;
    });
}

// Skill bars animation
function initializeSkillBars() {
    const skillBars = document.querySelectorAll('.skill-progress');
    
    const skillObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const skillBar = entry.target;
                const percentage = skillBar.parentElement.querySelector('.skill-percentage').textContent;
                
                // Animate skill bar
                setTimeout(() => {
                    skillBar.style.width = percentage;
                }, 500);
                
                // Unobserve after animation
                skillObserver.unobserve(skillBar);
            }
        });
    }, { threshold: 0.5 });
    
    skillBars.forEach(bar => {
        skillObserver.observe(bar);
    });
}
// Contact form functionality
function initializeContactForm() {
    const contactForm = document.querySelector('.contact-form');
    
    if (!contactForm) return;
    
    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const formData = new FormData(contactForm);
        const submitBtn = contactForm.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        
        // Show loading state
        submitBtn.textContent = 'Sending...';
        submitBtn.disabled = true;
        
        try {
            // Kirim data ke Formsfree endpoint
            const response = await fetch('https://formspree.io/f/xgvypare', {
                method: 'POST',
                body: formData,
                headers: {
                    'Accept': 'application/json'
                }
            });

            if (response.ok) {
                showNotification('Message sent successfully!', 'success');
                contactForm.reset();
            } else {
                showNotification('Failed to send message. Please try again.', 'error');
            }
        } catch (error) {
            showNotification('Failed to send message. Please try again.', 'error');
        } finally {
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
        }
    });
}


// Show notification
function showNotification(message, type) {
    // Remove existing notifications
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    
    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        color: white;
        font-weight: 600;
        z-index: 10000;
        transform: translateX(100%);
        transition: transform 0.3s ease;
        ${type === 'success' ? 'background: #e64774ff;' : 'background: #ef4444;'}
    `;
    
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Remove after 5 seconds
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 5000);
}

// Scroll to top button
function initializeScrollToTop() {
    const scrollToTopBtn = document.querySelector('.scroll-to-top');
    
    if (!scrollToTopBtn) {
        // Create scroll to top button if it doesn't exist
        const btn = document.createElement('button');
        btn.className = 'scroll-to-top';
        btn.innerHTML = '<i class="fas fa-chevron-up"></i>';
        btn.setAttribute('aria-label', 'Scroll to top');
        document.body.appendChild(btn);
        
        btn.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
        
        // Show/hide button based on scroll position
        window.addEventListener('scroll', () => {
            if (window.scrollY > 500) {
                btn.classList.add('show');
            } else {
                btn.classList.remove('show');
            }
        });
    }
}

// Loading screen
function initializeLoading() {
    const loading = document.querySelector('.loading');
    
    if (loading) {
        // Hide loading screen after a shorter delay
        setTimeout(() => {
            loading.classList.add('hide');
            setTimeout(() => {
                loading.remove();
            }, 500);
        }, 1500); // Reduced from 1000ms to 1500ms total
    }
}

// Utility functions
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Smooth reveal animation for elements
function revealOnScroll() {
    const reveals = document.querySelectorAll('.fade-in, .slide-in-left, .slide-in-right');
    
    reveals.forEach(element => {
        const elementTop = element.getBoundingClientRect().top;
        const elementVisible = 150;
        
        if (elementTop < window.innerHeight - elementVisible) {
            element.classList.add('visible');
        }
    });
}

// Initialize reveal on scroll with debounce
window.addEventListener('scroll', debounce(revealOnScroll, 10));

// Parallax effect for hero section
function initializeParallax() {
    const hero = document.querySelector('.hero');
    
    if (hero) {
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            const rate = scrolled * -0.5;
            
            if (scrolled < hero.offsetHeight) {
                hero.style.transform = `translateY(${rate}px)`;
            }
        });
    }
}

// Initialize parallax effect
initializeParallax();

// Typing animation for hero text
function initializeTypingAnimation() {
    const heroTitle = document.querySelector('.hero-title');
    
    if (heroTitle) {
        const text = heroTitle.textContent;
        heroTitle.textContent = '';
        
        let i = 0;
        const typeWriter = () => {
            if (i < text.length) {
                heroTitle.textContent += text.charAt(i);
                i++;
                setTimeout(typeWriter, 100);
            }
        };
        
        // Start typing animation after a delay
        setTimeout(typeWriter, 1000);
    }
}

// Project card interactions
function initializeProjectCards() {
    const projectCards = document.querySelectorAll('.project-card');
    
    projectCards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            card.style.transform = 'translateY(-10px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'translateY(0) scale(1)';
        });
    });
}

// Initialize project cards
initializeProjectCards();

// Add smooth scrolling for all anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Performance optimization: Lazy load images
function initializeLazyLoading() {
    const images = document.querySelectorAll('img[data-src]');
    
    const imageObserver = new IntersectionObserver((entries) => {
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

// Initialize lazy loading
initializeLazyLoading();

// Add custom cursor effect
function initializeCustomCursor() {
    const cursor = document.createElement('div');
    cursor.className = 'custom-cursor';
    cursor.style.cssText = `
        position: fixed;
        width: 20px;
        height: 20px;
        background: var(--primary-pink);
        border-radius: 50%;
        pointer-events: none;
        z-index: 9999;
        mix-blend-mode: difference;
        transition: transform 0.1s ease;
        opacity: 0;
    `;
    
    document.body.appendChild(cursor);
    
    document.addEventListener('mousemove', (e) => {
        cursor.style.left = e.clientX - 10 + 'px';
        cursor.style.top = e.clientY - 10 + 'px';
        cursor.style.opacity = '1';
    });
    
    document.addEventListener('mouseleave', () => {
        cursor.style.opacity = '0';
    });
    
    // Scale cursor on hover over interactive elements
    const interactiveElements = document.querySelectorAll('a, button, .project-card');
    
    interactiveElements.forEach(el => {
        el.addEventListener('mouseenter', () => {
            cursor.style.transform = 'scale(2)';
        });
        
        el.addEventListener('mouseleave', () => {
            cursor.style.transform = 'scale(1)';
        });
    });
}

// Initialize custom cursor (only on desktop)
if (window.innerWidth > 768) {
    initializeCustomCursor();
}

// Add page transition effects
function initializePageTransitions() {
    // Fade in page content
    document.body.style.opacity = '0';
    
    window.addEventListener('load', () => {
        document.body.style.transition = 'opacity 0.5s ease';
        document.body.style.opacity = '1';
    });
}

// Initialize page transitions
initializePageTransitions();

// Gallery slider functionality
let currentSlideIndex = {};

function initializeSliders() {
    const sliders = document.querySelectorAll('.gallery-slider');
    sliders.forEach(slider => {
        const sliderId = slider.id;
        if (sliderId) {
            currentSlideIndex[sliderId] = 1;
            showSlide(sliderId, 1);
        }
    });
}

function changeSlide(sliderId, direction) {
    const slider = document.getElementById(sliderId);
    if (!slider) return;
    
    const slides = slider.querySelectorAll('.gallery-slide');
    const totalSlides = slides.length;
    
    if (!currentSlideIndex[sliderId]) {
        currentSlideIndex[sliderId] = 1;
    }
    
    currentSlideIndex[sliderId] += direction;
    
    if (currentSlideIndex[sliderId] > totalSlides) {
        currentSlideIndex[sliderId] = 1;
    }
    if (currentSlideIndex[sliderId] < 1) {
        currentSlideIndex[sliderId] = totalSlides;
    }
    
    showSlide(sliderId, currentSlideIndex[sliderId]);
}

function currentSlide(sliderId, slideNumber) {
    if (!currentSlideIndex[sliderId]) {
        currentSlideIndex[sliderId] = 1;
    }
    currentSlideIndex[sliderId] = slideNumber;
    showSlide(sliderId, slideNumber);
}

function showSlide(sliderId, slideNumber) {
    const slider = document.getElementById(sliderId);
    if (!slider) return;
    
    const slides = slider.querySelectorAll('.gallery-slide');
    const galleryContainer = slider.closest('.gallery-container');
    const indicators = galleryContainer ? galleryContainer.querySelectorAll('.gallery-indicator') : [];
    
    // Hide all slides
    slides.forEach(slide => {
        slide.style.display = 'none';
    });
    
    // Remove active class from all indicators
    indicators.forEach(indicator => {
        indicator.classList.remove('active');
    });
    
    // Show current slide
    if (slides[slideNumber - 1]) {
        slides[slideNumber - 1].style.display = 'block';
    }
    
    // Add active class to current indicator
    if (indicators[slideNumber - 1]) {
        indicators[slideNumber - 1].classList.add('active');
    }
    
    // Move slider
    const translateX = -(slideNumber - 1) * 100;
    slider.style.transform = `translateX(${translateX}%)`;
}

// Auto-slide functionality (optional)
function autoSlide() {
    Object.keys(currentSlideIndex).forEach(sliderId => {
        changeSlide(sliderId, 1);
    });
}

// Initialize sliders when page loads
document.addEventListener('DOMContentLoaded', function() {
    // Initialize existing functionality
    initializeNavigation();
    initializeScrollEffects();
    initializeAnimations();
    initializeSkillBars();
    initializeContactForm();
    initializeScrollToTop();
    initializeLoading();
    initializeMobileMenu();
    
    // Initialize gallery sliders
    setTimeout(() => {
        initializeSliders();
    }, 1000);
});

// Fungsi toggle menu mobile
function toggleMobileMenu() {
  const mobileMenu = document.getElementById('mobileMenu');
  const mobileToggle = document.querySelector('.mobile-menu-toggle');
  
  mobileMenu.classList.toggle('active');
  mobileToggle.classList.toggle('active');
  
  document.body.style.overflow = mobileMenu.classList.contains('active') 
    ? 'hidden' 
    : '';
}

// Inisialisasi event listener
document.querySelector('.mobile-menu-toggle').addEventListener('click', toggleMobileMenu);

// Smooth scrolling untuk semua anchor link
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    
    if (target) {
      window.scrollTo({
        top: target.offsetTop - 80,
        behavior: 'smooth'
      });
      
      // Tutup mobile menu jika terbuka
      if (window.innerWidth <= 768) {
        toggleMobileMenu();
      }
    }
  });
});

// Perbaikan active state saat scroll
function updateActiveNavLink() {
  const sections = document.querySelectorAll('section');
  const navLinks = document.querySelectorAll('.nav-link, .mobile-nav-link');
  
  let currentSection = '';
  const scrollPosition = window.scrollY + 200;
  
  sections.forEach(section => {
    const sectionTop = section.offsetTop;
    const sectionHeight = section.offsetHeight;
    
    if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
      currentSection = section.getAttribute('id');
    }
  });
  
  navLinks.forEach(link => {
    link.classList.remove('active');
    if (link.getAttribute('href') === `#${currentSection}`) {
      link.classList.add('active');
    }
  });
}

window.addEventListener('scroll', updateActiveNavLink);

// Auto-slide every 8 seconds (optional)
setInterval(autoSlide, 8000);

// Make functions global for onclick handlers
window.changeSlide = changeSlide;
window.currentSlide = currentSlide;

// Console message for developers
console.log(`
🚀 Portfolio Website by Duyi Mardayanti Simanullang
💼 Full-Stack Developer & Project Management IT
🎨 Modern Pink & Black Theme
📱 Fully Responsive Design
⚡ Optimized Performance
🖼️ Interactive Gallery Sliders

Built with vanilla HTML, CSS, and JavaScript
`);
