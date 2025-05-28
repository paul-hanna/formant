// script.js - Contains all the JavaScript logic

// Set the current year in the footer
const currentYearElement = document.getElementById('currentYear');
if (currentYearElement) {
    currentYearElement.textContent = new Date().getFullYear();
}

// Mobile Menu Toggle
const mobileMenuButton = document.getElementById('mobile-menu-button');
const mobileMenuCloseButton = document.getElementById('mobile-menu-close-button');
const mobileMenu = document.getElementById('mobile-menu');
const mobileNavLinks = mobileMenu ? mobileMenu.querySelectorAll('a') : []; // Check if mobileMenu exists

if (mobileMenuButton && mobileMenu && mobileMenuCloseButton) {
    mobileMenuButton.addEventListener('click', () => {
        mobileMenu.classList.remove('translate-x-full');
        mobileMenu.classList.add('translate-x-0');
        document.body.style.overflow = 'hidden'; // Prevent scrolling when menu is open
    });

    mobileMenuCloseButton.addEventListener('click', () => {
        mobileMenu.classList.add('translate-x-full');
        mobileMenu.classList.remove('translate-x-0');
        document.body.style.overflow = '';
    });

    // Close mobile menu when a link is clicked
    mobileNavLinks.forEach(link => {
        link.addEventListener('click', () => {
            mobileMenu.classList.add('translate-x-full');
            mobileMenu.classList.remove('translate-x-0');
            document.body.style.overflow = '';
        });
    });
}


// Smooth scroll for navigation links (Desktop and Mobile)
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        // Prevent default only if it's an internal link
        if (this.getAttribute('href').startsWith('#')) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                let navHeight = 0;
                const navElement = document.querySelector('nav'); 
                if (navElement && getComputedStyle(navElement).position === 'sticky') {
                     navHeight = navElement.offsetHeight;
                }

                const scrollMarginTopValue = getComputedStyle(targetElement).scrollMarginTop;
                const scrollMarginTop = parseFloat(scrollMarginTopValue) || 20; // Default buffer
                
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - navHeight - scrollMarginTop;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        }
    });
});

// Contact Form Submission
const contactForm = document.getElementById('contact-form');
const formStatus = document.getElementById('form-status');
const submitButton = document.getElementById('submit-button');

if (contactForm && formStatus && submitButton) {
    contactForm.addEventListener('submit', async function(event) {
        event.preventDefault();
        
        const originalButtonText = submitButton.innerHTML;
        submitButton.innerHTML = 'Sending...';
        submitButton.disabled = true;
        formStatus.innerHTML = ''; // Clear previous messages

        const formData = new FormData(contactForm);
        const action = contactForm.getAttribute('action');

        // Check if the Formspree URL is still the placeholder
        if (action.includes("YOUR_FORM_ID")) {
            formStatus.innerHTML = '<p class="text-red-600">Please replace YOUR_FORM_ID in the HTML with your Formspree URL.</p>';
            submitButton.innerHTML = originalButtonText;
            submitButton.disabled = false;
            return; // Stop the submission
        }


        try {
            const response = await fetch(action, {
                method: 'POST',
                body: formData,
                headers: {
                    'Accept': 'application/json'
                }
            });

            if (response.ok) {
                formStatus.innerHTML = '<p class="text-green-600">Thanks for your message! We\'ll be in touch soon.</p>';
                contactForm.reset(); // Clear the form
            } else {
                // Try to parse error from Formspree
                const data = await response.json();
                if (data && data.errors) {
                    formStatus.innerHTML = `<p class="text-red-600">${data.errors.map(error => error.message).join(", ")}</p>`;
                } else {
                    formStatus.innerHTML = '<p class="text-red-600">Oops! There was a problem submitting your form. Please try again.</p>';
                }
            }
        } catch (error) {
            formStatus.innerHTML = '<p class="text-red-600">Oops! There was a problem submitting your form. Please check your network connection.</p>';
        } finally {
            submitButton.innerHTML = originalButtonText;
            submitButton.disabled = false;
        }
    });
}