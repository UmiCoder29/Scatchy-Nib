// Contact form validation and feedback
const contactForm = document.querySelector('.contact-form');
const feedback = contactForm.querySelector('.form-feedback');
const contactBtn = contactForm.querySelector('.contact-btn');
const spinner = contactBtn.querySelector('.spinner');
const checkmark = contactBtn.querySelector('.checkmark');

// Debounce function for performance optimization
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

// Optimized form validation
const validateForm = debounce((form) => {
    const name = form.name.value.trim();
    const email = form.email.value.trim();
    const message = form.message.value.trim();
    
    if (!name || !/^[a-zA-Z\s]+$/.test(name)) {
        return { valid: false, message: 'Please enter a valid name (letters only).' };
    }
    if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
        return { valid: false, message: 'Please enter a valid email address.' };
    }
    if (!message) {
        return { valid: false, message: 'Please enter your message.' };
    }
    return { valid: true };
}, 100);

// Optimized contact form submission
contactForm.addEventListener('submit', function(e) {
    e.preventDefault();
    feedback.style.display = 'none';
    feedback.textContent = '';
    
    const validation = validateForm(contactForm);
    if (!validation.valid) {
        feedback.textContent = validation.message;
        feedback.style.color = 'crimson';
        feedback.style.display = 'block';
        return;
    }
    
    requestAnimationFrame(() => {
        contactBtn.classList.add('loading');
        spinner.style.display = 'inline-block';
        
        setTimeout(() => {
            requestAnimationFrame(() => {
                contactBtn.classList.remove('loading');
                contactBtn.classList.add('success');
                checkmark.style.display = 'inline-block';
                feedback.textContent = 'Thank you for reaching out! We will get back to you soon.';
                feedback.style.color = 'seagreen';
                feedback.style.display = 'block';
                contactForm.reset();
                
                setTimeout(() => {
                    requestAnimationFrame(() => {
                        contactBtn.classList.remove('success');
                        checkmark.style.display = 'none';
                        feedback.style.display = 'none';
                    });
                }, 3000);
            });
        }, 1200);
    });
});

// Enhanced mobile menu functionality
const hamburger = document.querySelector('.nav-hamburger');
const mobileNavLinks = document.querySelector('.nav-links');
const mobileBackdrop = document.querySelector('.mobile-backdrop');
let isMenuOpen = false;
let touchStartX = 0;
let touchEndX = 0;

function toggleMobileMenu(shouldOpen) {
    isMenuOpen = typeof shouldOpen === 'boolean' ? shouldOpen : !isMenuOpen;
    
    // Toggle classes for animation
    hamburger.classList.toggle('active', isMenuOpen);
    mobileNavLinks.classList.toggle('mobile-open', isMenuOpen);
    mobileBackdrop.classList.toggle('active', isMenuOpen);
    
    // Prevent body scroll when menu is open
    document.body.style.overflow = isMenuOpen ? 'hidden' : '';
    
    // Animate menu items with improved timing
    const menuItems = mobileNavLinks.querySelectorAll('a');
    menuItems.forEach((item, index) => {
        if (isMenuOpen) {
            item.style.transitionDelay = `${0.05 + (index * 0.05)}s`;
            item.style.transform = 'translateX(0)';
            item.style.opacity = '1';
        } else {
            item.style.transitionDelay = '0s';
            item.style.transform = 'translateX(50px)';
            item.style.opacity = '0';
        }
    });
}

// Touch event handlers for swipe gestures
mobileNavLinks.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
});

mobileNavLinks.addEventListener('touchend', (e) => {
    touchEndX = e.changedTouches[0].screenX;
    handleSwipe();
});

function handleSwipe() {
    const swipeThreshold = 50;
    const swipeDistance = touchEndX - touchStartX;
    
    if (Math.abs(swipeDistance) > swipeThreshold) {
        if (swipeDistance > 0 && isMenuOpen) {
            // Swipe right - close menu
            toggleMobileMenu(false);
        } else if (swipeDistance < 0 && !isMenuOpen) {
            // Swipe left - open menu
            toggleMobileMenu(true);
        }
    }
}

// Enhanced event listeners
hamburger.addEventListener('click', () => toggleMobileMenu());
mobileBackdrop.addEventListener('click', () => toggleMobileMenu(false));

// Close menu when a link is clicked
document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => {
        if (window.innerWidth <= 900) {
            toggleMobileMenu(false);
        }
    });
});

// Close menu on escape key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && isMenuOpen) {
        toggleMobileMenu(false);
    }
});

// Close menu on window resize
window.addEventListener('resize', () => {
    if (window.innerWidth > 900 && isMenuOpen) {
        toggleMobileMenu(false);
    }
});

// Initialize menu items
function initializeMenuItems() {
    const menuItems = mobileNavLinks.querySelectorAll('a');
    menuItems.forEach(item => {
        item.style.transition = 'transform 0.3s ease, opacity 0.3s ease';
        item.style.transform = 'translateX(50px)';
        item.style.opacity = '0';
    });
}

// Call initialization when DOM is loaded
document.addEventListener('DOMContentLoaded', initializeMenuItems);

// Add padding to body when menu is open to prevent content jump
function updateBodyPadding() {
    if (window.innerWidth <= 900) {
        const navHeight = document.querySelector('nav').offsetHeight;
        document.documentElement.style.setProperty('--nav-height', `${navHeight}px`);
        document.body.style.paddingTop = isMenuOpen ? `${navHeight}px` : '0';
    } else {
        document.body.style.paddingTop = '0';
    }
}

// Improved resize handling with debounce
const resizeHandler = debounce(() => {
    requestAnimationFrame(() => {
        if (window.innerWidth > 900 && isMenuOpen) {
            toggleMobileMenu(false);
        }
        updateBodyPadding();
    });
}, 100);

window.addEventListener('resize', resizeHandler, { passive: true });

// Initial padding setup
updateBodyPadding();

// Optimized loader
function hideLoader() {
    requestAnimationFrame(() => {
        const overlay = document.getElementById('loaderOverlay');
        if (overlay && !overlay.classList.contains('hide')) {
            overlay.classList.add('hide');
        }
    });
}

// Initialize loader with optimized timing
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(hideLoader, 3000);
});

// Scrollspy for navbar
const navLinks = document.querySelectorAll('.nav-links a');
const sections = [
    document.getElementById('hero'),
    document.getElementById('features'),
    document.getElementById('stats'),
    document.getElementById('news'),
    document.getElementById('contact')
];

function setActiveLink() {
    let index = 0;
    for (let i = 0; i < sections.length; i++) {
        const rect = sections[i].getBoundingClientRect();
        if (rect.top <= 80) index = i;
    }
    navLinks.forEach(l => l.classList.remove('active'));
    if (navLinks[index]) navLinks[index].classList.add('active');
}

// Optimized scroll handling
const scrollHandler = debounce(() => {
    requestAnimationFrame(() => {
        setActiveLink();
        if (window.scrollY > 10) {
            nav.classList.add('scrolled');
        } else {
            nav.classList.remove('scrolled');
        }
    });
}, 10);

window.addEventListener('scroll', scrollHandler, { passive: true });

// Navbar shadow/blur on scroll
const nav = document.getElementById('mainNav');
let lastScroll = 0;

function handleScroll() {
    const currentScroll = window.pageYOffset;
    
    // Add scrolled class when scrolling down
    if (currentScroll > 50) {
        nav.classList.add('scrolled');
    } else {
        nav.classList.remove('scrolled');
    }
    
    lastScroll = currentScroll;
}

// Use debounce to optimize scroll performance
const debouncedScroll = debounce(handleScroll, 10);
window.addEventListener('scroll', debouncedScroll);

// Initial check for scroll position
handleScroll();

// Mobile Hero Parallax Effect
const mobileHeroImg = document.querySelector('.mobile-hero-img');
let lastScrollY = window.scrollY;
let ticking = false;

// Optimized parallax effect
let parallaxHandler = () => {
    if (!ticking) {
        requestAnimationFrame(() => {
            if (window.innerWidth <= 900) {
                const scrollY = window.scrollY;
                const translateY = scrollY * 0.3;
                mobileHeroImg.style.transform = `translate3d(0, ${translateY}px, 0)`;
            }
            ticking = false;
        });
        ticking = true;
    }
};

window.addEventListener('scroll', parallaxHandler, { passive: true });

// Update on resize
window.addEventListener('resize', () => {
    if (window.innerWidth > 900) {
        mobileHeroImg.style.transform = 'translateY(0)';
    }
});

// --- Floating Nav Icon & Menu (Desktop Only) ---
const floatingNavIcon = document.getElementById('floatingNavIcon');
const floatingNavMenu = document.getElementById('floatingNavMenu');
let isDragging = false,
    dragOffsetX = 0,
    dragOffsetY = 0;

// Only initialize floating nav for desktop
if (window.innerWidth > 900) {
    // Show icon after scrolling 200px
    window.addEventListener('scroll', function() {
        if (window.scrollY > 200) {
            floatingNavIcon.classList.add('visible');
        } else {
            floatingNavIcon.classList.remove('visible');
            floatingNavMenu.classList.remove('open');
        }
    });

    // Toggle menu on icon click
    floatingNavIcon.addEventListener('click', function(e) {
        floatingNavMenu.classList.toggle('open');
    });

    // Close menu on outside click
    document.addEventListener('mousedown', function(e) {
        if (!floatingNavMenu.contains(e.target) && !floatingNavIcon.contains(e.target)) {
            floatingNavMenu.classList.remove('open');
        }
    });

    // Close menu on nav link click
    document.querySelectorAll('.floating-nav-links a').forEach(link => {
        link.addEventListener('click', function() {
            floatingNavMenu.classList.remove('open');
        });
    });

    // Drag functionality
    floatingNavIcon.addEventListener('mousedown', function(e) {
        isDragging = true;
        dragOffsetX = e.clientX - floatingNavIcon.getBoundingClientRect().left;
        dragOffsetY = e.clientY - floatingNavIcon.getBoundingClientRect().top;
        document.body.style.userSelect = 'none';
    });

    document.addEventListener('mousemove', function(e) {
        if (isDragging) {
            let x = e.clientX - dragOffsetX;
            let y = e.clientY - dragOffsetY;
            // Keep within viewport
            x = Math.max(0, Math.min(window.innerWidth - floatingNavIcon.offsetWidth, x));
            y = Math.max(0, Math.min(window.innerHeight - floatingNavIcon.offsetHeight, y));
            floatingNavIcon.style.left = x + 'px';
            floatingNavIcon.style.top = y + 'px';
            floatingNavIcon.style.right = 'auto';
            floatingNavIcon.style.bottom = 'auto';
        }
    });

    document.addEventListener('mouseup', function(e) {
        isDragging = false;
        document.body.style.userSelect = '';
    });

    // Keyboard accessibility
    floatingNavIcon.addEventListener('keydown', function(e) {
        if (e.key === 'Enter' || e.key === ' ') {
            floatingNavMenu.classList.toggle('open');
        }
    });

    // Ripple effect
    floatingNavIcon.addEventListener('click', function(e) {
        const ripple = document.createElement('span');
        ripple.className = 'ripple';
        const rect = floatingNavIcon.getBoundingClientRect();
        ripple.style.width = ripple.style.height = Math.max(rect.width, rect.height) + 'px';
        ripple.style.left = (e.clientX - rect.left - rect.width / 2) + 'px';
        ripple.style.top = (e.clientY - rect.top - rect.height / 2) + 'px';
        floatingNavIcon.appendChild(ripple);
        setTimeout(() => ripple.remove(), 500);
    }, true);
}

// Remove floating nav notification for mobile
function showFloatingNavNotification(type) {
    if (window.innerWidth <= 900) return; // Don't show notification on mobile

    const notif = document.getElementById('floatingNavNotification');
    if (!notif) return;

    if (type === 'mobile') {
        notif.textContent = 'Tap the floating icon to open quick navigation!';
    } else {
        notif.textContent = 'Try the floating icon for quick navigation!';
    }

    notif.style.display = 'block';
    notif.style.opacity = '0.97';
    setTimeout(() => {
        notif.style.opacity = '0';
        setTimeout(() => notif.style.display = 'none', 400);
    }, 4000);

    notif.addEventListener('click', function hideNotif() {
        notif.style.opacity = '0';
        setTimeout(() => notif.style.display = 'none', 400);
        notif.removeEventListener('click', hideNotif);
    });
}

// Only show notification for desktop
function maybeShowFloatingNavNotification() {
    if (window.innerWidth <= 900) return; // Don't show notification on mobile

    const isDesktop = window.innerWidth > 900;
    const iconVisible = document.getElementById('floatingNavIcon').classList.contains('visible');

    if (isDesktop && iconVisible) {
        showFloatingNavNotification('desktop');
    }
}

// Only add event listeners for desktop
if (window.innerWidth > 900) {
    window.addEventListener('scroll', maybeShowFloatingNavNotification);
    window.addEventListener('resize', maybeShowFloatingNavNotification);
    window.addEventListener('DOMContentLoaded', maybeShowFloatingNavNotification);
}

// Mobile dropdown menu functionality
const dropdownTriggers = document.querySelectorAll('.dropdown-trigger');

dropdownTriggers.forEach(trigger => {
    trigger.addEventListener('click', function(e) {
        if (window.innerWidth <= 900) {
            e.preventDefault();
            const dropdown = this.nextElementSibling;
            const isOpen = dropdown.style.display === 'block';
            
            // Close all other dropdowns
            document.querySelectorAll('.dropdown-menu').forEach(menu => {
                if (menu !== dropdown) {
                    menu.style.display = 'none';
                }
            });
            
            // Toggle current dropdown
            dropdown.style.display = isOpen ? 'none' : 'block';
            
            // Rotate arrow icon
            const icon = this.querySelector('i');
            icon.style.transform = isOpen ? 'rotate(0deg)' : 'rotate(180deg)';
        }
    });
});

// Close dropdowns when clicking outside
document.addEventListener('click', function(e) {
    if (window.innerWidth <= 900) {
        if (!e.target.closest('.nav-dropdown')) {
            document.querySelectorAll('.dropdown-menu').forEach(menu => {
                menu.style.display = 'none';
            });
            document.querySelectorAll('.dropdown-trigger i').forEach(icon => {
                icon.style.transform = 'rotate(0deg)';
            });
        }
    }
});

// Handle mobile dropdowns
dropdowns.forEach(dropdown => {
    const dropdownLink = dropdown.querySelector('a');
    dropdownLink.addEventListener('click', (e) => {
        if (window.innerWidth <= 900) {
            e.preventDefault();
            dropdown.classList.toggle('active');
        }
    });
});

// Close mobile menu when clicking outside
document.addEventListener('click', (e) => {
    if (!e.target.closest('.nav-links') && !e.target.closest('.nav-hamburger')) {
        dropdowns.forEach(dropdown => {
            dropdown.classList.remove('active');
        });
    }
});

// Form Validation and Submission
document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('contactForm');
    const submitBtn = document.getElementById('submitBtn');
    const nameInput = document.getElementById('name');
    const emailInput = document.getElementById('email');
    const messageInput = document.getElementById('message');
    const formSuccess = document.getElementById('formSuccess');
    const formError = document.getElementById('formError');

    // Custom validation messages
    const validationMessages = {
        name: {
            valueMissing: 'Please enter your name',
            tooShort: 'Name must be at least 2 characters long',
            tooLong: 'Name must be less than 50 characters',
            patternMismatch: 'Name can only contain letters and spaces'
        },
        email: {
            valueMissing: 'Please enter your email',
            typeMismatch: 'Please enter a valid email address',
            patternMismatch: 'Please enter a valid email address'
        },
        message: {
            valueMissing: 'Please enter your message',
            tooShort: 'Message must be at least 10 characters long',
            tooLong: 'Message must be less than 1000 characters'
        }
    };

    // Show error message
    function showError(input, message) {
        const errorElement = document.getElementById(input.id + 'Error');
        errorElement.textContent = message;
        input.classList.add('invalid');
    }

    // Clear error message
    function clearError(input) {
        const errorElement = document.getElementById(input.id + 'Error');
        errorElement.textContent = '';
        input.classList.remove('invalid');
    }

    // Validate input
    function validateInput(input) {
        if (input.validity.valid) {
            clearError(input);
            return true;
        }

        for (const error in validationMessages[input.name]) {
            if (input.validity[error]) {
                showError(input, validationMessages[input.name][error]);
                return false;
            }
        }
    }

    // Real-time validation
    [nameInput, emailInput, messageInput].forEach(input => {
        input.addEventListener('input', () => {
            validateInput(input);
        });

        input.addEventListener('blur', () => {
            validateInput(input);
        });
    });

    // Handle button click
    submitBtn.addEventListener('click', async function() {
        // Validate all inputs
        const isNameValid = validateInput(nameInput);
        const isEmailValid = validateInput(emailInput);
        const isMessageValid = validateInput(messageInput);

        if (!isNameValid || !isEmailValid || !isMessageValid) {
            return;
        }

        // Show loading state
        submitBtn.classList.add('loading');
        submitBtn.disabled = true;

        try {
            // Get form data
            const formData = {
                name: nameInput.value,
                email: emailInput.value,
                message: messageInput.value
            };

            // Simulate form submission (replace with actual API call)
            await new Promise(resolve => setTimeout(resolve, 1500));

            // Show success state
            submitBtn.classList.remove('loading');
            submitBtn.classList.add('success');
            formSuccess.style.display = 'block';
            formSuccess.classList.add('show');

            // Clear form fields without resetting the form
            nameInput.value = '';
            emailInput.value = '';
            messageInput.value = '';
            
            // Remove any validation states
            [nameInput, emailInput, messageInput].forEach(input => {
                input.classList.remove('invalid');
                clearError(input);
            });

            // Reset button state after animation
            setTimeout(() => {
                submitBtn.classList.remove('success');
                submitBtn.disabled = false;
                formSuccess.classList.remove('show');
                setTimeout(() => {
                    formSuccess.style.display = 'none';
                }, 300);
            }, 2000);

        } catch (error) {
            // Show error state
            submitBtn.classList.remove('loading');
            submitBtn.disabled = false;
            formError.style.display = 'block';
            formError.classList.add('show');

            // Hide error message after 5 seconds
            setTimeout(() => {
                formError.classList.remove('show');
                setTimeout(() => {
                    formError.style.display = 'none';
                }, 300);
            }, 5000);
        }
    });
});