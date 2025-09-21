// Global variables
let currentLanguage = 'ru';
let translations = {};

// DOM elements
const hamburger = document.getElementById('hamburger');
const navMenu = document.getElementById('nav-menu');
const langBtn = document.getElementById('lang-btn');
const contactForm = document.getElementById('contactForm');

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    initializeLanguageSwitcher();
    initializeNavigation();
    initializeContactForm();
    initializeAnimations();
    initializeDonateButton();
});

// Language switching functionality
function initializeLanguageSwitcher() {
    // Collect all translatable elements
    collectTranslations();
    
    // Set initial language
    updateLanguageButton();
}

function collectTranslations() {
    const elements = document.querySelectorAll('[data-ru][data-en]');
    elements.forEach(element => {
        const id = generateElementId(element);
        translations[id] = {
            element: element,
            ru: element.getAttribute('data-ru'),
            en: element.getAttribute('data-en')
        };
    });
}

function generateElementId(element) {
    // Generate a unique ID for each translatable element
    if (!element.id) {
        element.id = 'translate-' + Math.random().toString(36).substr(2, 9);
    }
    return element.id;
}

function toggleLanguage() {
    currentLanguage = currentLanguage === 'ru' ? 'en' : 'ru';
    updateContent();
    updateLanguageButton();
    
    // Store language preference
    localStorage.setItem('preferred-language', currentLanguage);
}

function updateContent() {
    Object.keys(translations).forEach(id => {
        const translation = translations[id];
        const element = translation.element;
        const text = translation[currentLanguage];
        
        if (text) {
            if (element.tagName === 'INPUT' && element.type !== 'submit') {
                element.placeholder = text;
            } else {
                element.textContent = text;
            }
        }
    });
    
    // Update form labels and placeholders
    updateFormLabels();
}

function updateFormLabels() {
    const formLabels = {
        ru: {
            name: 'Имя',
            email: 'Email',
            phone: 'Номер телефона',
            subject: 'Тема',
            message: 'Сообщение',
            submit: 'Отправить',
            namePlaceholder: 'Введите ваше имя',
            emailPlaceholder: 'Введите ваш email',
            phonePlaceholder: '+996 (xxx) xxx-xxx',
            subjectPlaceholder: 'Тема сообщения',
            messagePlaceholder: 'Ваше сообщение...'
        },
        en: {
            name: 'Name',
            email: 'Email',
            phone: 'Phone Number',
            subject: 'Subject',
            message: 'Message',
            submit: 'Send',
            namePlaceholder: 'Enter your name',
            emailPlaceholder: 'Enter your email',
            phonePlaceholder: '+1 (xxx) xxx-xxxx',
            subjectPlaceholder: 'Message subject',
            messagePlaceholder: 'Your message...'
        }
    };
    
    const labels = formLabels[currentLanguage];
    
    // Update form elements
    const nameInput = document.getElementById('name');
    const emailInput = document.getElementById('email');
    const phoneInput = document.getElementById('phone');
    const subjectInput = document.getElementById('subject');
    const messageInput = document.getElementById('message');
    const submitBtn = document.querySelector('.contact-form .btn-primary');
    
    if (nameInput) nameInput.placeholder = labels.namePlaceholder;
    if (emailInput) emailInput.placeholder = labels.emailPlaceholder;
    if (phoneInput) phoneInput.placeholder = labels.phonePlaceholder;
    if (subjectInput) subjectInput.placeholder = labels.subjectPlaceholder;
    if (messageInput) messageInput.placeholder = labels.messagePlaceholder;
    if (submitBtn && !submitBtn.getAttribute('data-ru')) {
        submitBtn.textContent = labels.submit;
    }
}

function updateLanguageButton() {
    if (langBtn) {
        langBtn.textContent = currentLanguage === 'ru' ? 'EN' : 'RU';
    }
}

// Navigation functionality
function initializeNavigation() {
    // Mobile menu toggle
    if (hamburger && navMenu) {
        hamburger.addEventListener('click', () => {
            navMenu.classList.toggle('active');
            hamburger.classList.toggle('active');
        });
    }
    
    // Close mobile menu when clicking on a link
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('active');
            hamburger.classList.remove('active');
        });
    });
    
    // Smooth scroll for navigation links
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                const headerHeight = document.querySelector('.navbar').offsetHeight;
                const targetPosition = targetSection.getBoundingClientRect().top + window.pageYOffset - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Add scroll effect to navbar
    window.addEventListener('scroll', () => {
        const navbar = document.querySelector('.navbar');
        if (window.scrollY > 50) {
            navbar.style.background = 'rgba(255, 255, 255, 0.95)';
            navbar.style.backdropFilter = 'blur(10px)';
        } else {
            navbar.style.background = '#ffffff';
            navbar.style.backdropFilter = 'none';
        }
    });
}

// Contact form functionality
function initializeContactForm() {
    if (contactForm) {
        contactForm.addEventListener('submit', handleFormSubmit);
        
        // Add phone number formatting
        const phoneInput = document.getElementById('phone');
        if (phoneInput) {
            phoneInput.addEventListener('input', formatPhoneNumber);
        }
    }
}

function formatPhoneNumber(e) {
    let value = e.target.value.replace(/\D/g, '');
    
    if (currentLanguage === 'ru') {
        // Kyrgyzstan format: +996 (xxx) xxx-xxx
        if (value.startsWith('0')) {
            value = '996' + value.slice(1);
        }
        if (value.startsWith('996') && value.length <= 12) {
            if (value.length > 3) value = value.replace(/^(\d{3})(\d{0,3})/, '+$1 ($2');
            if (value.length > 9) value = value.replace(/(\+\d{3} \(\d{3})(\d{0,3})/, '$1) $2');
            if (value.length > 13) value = value.replace(/(\+\d{3} \(\d{3}\) \d{3})(\d{0,3})/, '$1-$2');
        }
    } else {
        // International format: +1 (xxx) xxx-xxxx
        if (value.length > 0 && !value.startsWith('1')) {
            value = '1' + value;
        }
        if (value.startsWith('1') && value.length <= 11) {
            if (value.length > 1) value = value.replace(/^(\d{1})(\d{0,3})/, '+$1 ($2');
            if (value.length > 7) value = value.replace(/(\+\d{1} \(\d{3})(\d{0,3})/, '$1) $2');
            if (value.length > 12) value = value.replace(/(\+\d{1} \(\d{3}\) \d{3})(\d{0,4})/, '$1-$2');
        }
    }
    
    e.target.value = value;
}

function handleFormSubmit(e) {
    e.preventDefault();
    
    const formData = new FormData(contactForm);
    const formObject = {};
    
    formData.forEach((value, key) => {
        formObject[key] = value;
    });
    
    // Validate form
    if (validateForm(formObject)) {
        showFormMessage('success');
        contactForm.reset();
    } else {
        showFormMessage('error');
    }
}

function validateForm(data) {
    // Basic validation
    if (!data.name || !data.email || !data.subject || !data.message) {
        return false;
    }
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.email)) {
        return false;
    }
    
    // Phone validation (optional field)
    if (data.phone && data.phone.trim() !== '') {
        const phoneRegex = /^[\+]?[(]?[\d\s\-\(\)]{10,}$/;
        if (!phoneRegex.test(data.phone.replace(/\s/g, ''))) {
            return false;
        }
    }
    
    return true;
}

function showFormMessage(type) {
    // Remove existing messages
    const existingMessages = document.querySelectorAll('.form-success, .form-error');
    existingMessages.forEach(msg => msg.remove());
    
    const messageDiv = document.createElement('div');
    messageDiv.className = type === 'success' ? 'form-success' : 'form-error';
    
    const messages = {
        success: {
            ru: 'Сообщение успешно отправлено! Мы свяжемся с вами в ближайшее время.',
            en: 'Message sent successfully! We will contact you soon.'
        },
        error: {
            ru: 'Ошибка при отправке сообщения. Пожалуйста, проверьте введенные данные.',
            en: 'Error sending message. Please check your input data.'
        }
    };
    
    messageDiv.textContent = messages[type][currentLanguage];
    contactForm.insertBefore(messageDiv, contactForm.firstChild);
    
    // Remove message after 5 seconds
    setTimeout(() => {
        messageDiv.remove();
    }, 5000);
}

// Animation functionality
function initializeAnimations() {
    // Intersection Observer for animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in-up');
            }
        });
    }, observerOptions);
    
    // Observe elements for animation
    const animateElements = document.querySelectorAll('.stage-card, .research-card, .contact-form-container');
    animateElements.forEach(el => {
        observer.observe(el);
    });
}

// Donate button functionality
function initializeDonateButton() {
    const donateButtons = document.querySelectorAll('.donate-btn');
    
    donateButtons.forEach(btn => {
        btn.addEventListener('click', handleDonateClick);
    });
}

function handleDonateClick() {
    const donateMessages = {
        ru: 'Функция доната находится в разработке. Спасибо за вашу поддержку!',
        en: 'Donate functionality is under development. Thank you for your support!'
    };
    
    alert(donateMessages[currentLanguage]);
}

// Utility functions
function scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
        const headerHeight = document.querySelector('.navbar').offsetHeight;
        const targetPosition = section.getBoundingClientRect().top + window.pageYOffset - headerHeight;
        
        window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
        });
    }
}

// Load saved language preference
function loadLanguagePreference() {
    const savedLanguage = localStorage.getItem('preferred-language');
    if (savedLanguage && savedLanguage !== currentLanguage) {
        currentLanguage = savedLanguage;
        updateContent();
        updateLanguageButton();
    }
}

// Initialize language preference on page load
document.addEventListener('DOMContentLoaded', () => {
    loadLanguagePreference();
});

// Smooth scroll to top functionality
function scrollToTop() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}

// Add scroll to top button functionality
document.addEventListener('DOMContentLoaded', () => {
    // Create scroll to top button
    const scrollTopBtn = document.createElement('button');
    scrollTopBtn.innerHTML = '↑';
    scrollTopBtn.className = 'scroll-top-btn';
    scrollTopBtn.style.cssText = `
        position: fixed;
        bottom: 30px;
        right: 30px;
        width: 50px;
        height: 50px;
        background: var(--gradient-primary);
        color: white;
        border: none;
        border-radius: 50%;
        cursor: pointer;
        font-size: 20px;
        display: none;
        z-index: 1000;
        transition: all 0.3s ease;
        box-shadow: var(--shadow);
    `;
    
    document.body.appendChild(scrollTopBtn);
    
    scrollTopBtn.addEventListener('click', scrollToTop);
    
    // Show/hide scroll to top button
    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 300) {
            scrollTopBtn.style.display = 'block';
        } else {
            scrollTopBtn.style.display = 'none';
        }
    });
    
    // Add hover effect
    scrollTopBtn.addEventListener('mouseenter', () => {
        scrollTopBtn.style.transform = 'translateY(-3px)';
        scrollTopBtn.style.boxShadow = 'var(--shadow-hover)';
    });
    
    scrollTopBtn.addEventListener('mouseleave', () => {
        scrollTopBtn.style.transform = 'translateY(0)';
        scrollTopBtn.style.boxShadow = 'var(--shadow)';
    });
});

// Preloader functionality
function showPreloader() {
    const preloader = document.createElement('div');
    preloader.className = 'preloader';
    preloader.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: white;
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 9999;
        transition: opacity 0.3s ease;
    `;
    
    preloader.innerHTML = `
        <div style="
            width: 50px;
            height: 50px;
            border: 3px solid #f3f3f3;
            border-top: 3px solid var(--primary-color);
            border-radius: 50%;
            animation: spin 1s linear infinite;
        "></div>
        <style>
            @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
            }
        </style>
    `;
    
    document.body.appendChild(preloader);
    
    // Hide preloader after page load
    window.addEventListener('load', () => {
        setTimeout(() => {
            preloader.style.opacity = '0';
            setTimeout(() => {
                preloader.remove();
            }, 300);
        }, 500);
    });
}

// Initialize preloader
document.addEventListener('DOMContentLoaded', showPreloader);

// Performance optimization: Lazy loading for images
function initializeLazyLoading() {
    const images = document.querySelectorAll('img[data-src]');
    
    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.removeAttribute('data-src');
                imageObserver.unobserve(img);
            }
        });
    });
    
    images.forEach(img => imageObserver.observe(img));
}

// Initialize all functionality when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    initializeLazyLoading();
});

// Error handling for missing elements
function safeQuerySelector(selector) {
    try {
        return document.querySelector(selector);
    } catch (error) {
        console.warn(`Element not found: ${selector}`);
        return null;
    }
}

// Accessibility improvements
function initializeAccessibility() {
    // Add skip to content link
    const skipLink = document.createElement('a');
    skipLink.href = '#main';
    skipLink.textContent = currentLanguage === 'ru' ? 'Перейти к содержимому' : 'Skip to content';
    skipLink.className = 'skip-link';
    skipLink.style.cssText = `
        position: absolute;
        top: -40px;
        left: 6px;
        background: var(--primary-color);
        color: white;
        padding: 8px;
        text-decoration: none;
        z-index: 1001;
        border-radius: 4px;
        transition: top 0.2s ease;
    `;
    
    skipLink.addEventListener('focus', () => {
        skipLink.style.top = '6px';
    });
    
    skipLink.addEventListener('blur', () => {
        skipLink.style.top = '-40px';
    });
    
    document.body.insertBefore(skipLink, document.body.firstChild);
}

// Initialize accessibility features
document.addEventListener('DOMContentLoaded', initializeAccessibility);

// Export functions for global use
window.toggleLanguage = toggleLanguage;
window.scrollToSection = scrollToSection;