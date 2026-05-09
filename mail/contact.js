// ============================= 
// Modern Contact Form Handler
// =============================
// Google Apps Script Configuration loaded from config.json

"use strict";

let GOOGLE_APPS_SCRIPT_URL = '';

// Load configuration
async function loadConfig() {
    try {
        const response = await fetch('../config.json');
        const config = await response.json();
        GOOGLE_APPS_SCRIPT_URL = config.GOOGLE_APPS_SCRIPT_URL;
    } catch (error) {
        console.error('Error loading config:', error);
    }
}

document.addEventListener('DOMContentLoaded', async () => {
    await loadConfig();
    const contactForm = document.querySelector('.contact-form');
    
    if (!contactForm) {
        console.warn('Contact form not found');
        return;
    }

    // ============================= 
    // Form Submission
    // =============================
    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        // Get form data
        const formData = new FormData(contactForm);
        const data = Object.fromEntries(formData);
        
        // Get submit button
        const submitBtn = contactForm.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        
        try {
            // Disable button and show loading state
            submitBtn.disabled = true;
            submitBtn.textContent = 'Sending...';
            
            // Send request to Google Apps Script
            const response = await fetch(GOOGLE_APPS_SCRIPT_URL, {
                method: 'POST',
                body: new URLSearchParams(data)
            });
            
            const result = await response.json();
            
            // Show success or error message
            if (result.success) {
                showMessage('success', result.message);
                contactForm.reset();
                submitBtn.textContent = 'Message Sent!';
                setTimeout(() => {
                    submitBtn.textContent = originalText;
                    submitBtn.disabled = false;
                }, 3000);
            } else {
                showMessage('error', result.message || 'Failed to send message');
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
            }
        } catch (error) {
            console.error('Error:', error);
            showMessage('error', 'An error occurred. Please try again later.');
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
        }
    });

    // ============================= 
    // Form Validation
    // =============================
    const inputs = contactForm.querySelectorAll('input, textarea');
    
    inputs.forEach(input => {
        // Real-time validation
        input.addEventListener('blur', () => {
            validateField(input);
        });
        
        input.addEventListener('focus', () => {
            clearFieldError(input);
        });
    });

    // ============================= 
    // Validation Functions
    // =============================
    function validateField(field) {
        const value = field.value.trim();
        let isValid = true;
        let errorMessage = '';
        
        if (field.name === 'name') {
            if (value.length < 2) {
                isValid = false;
                errorMessage = 'Name must be at least 2 characters';
            }
        } else if (field.name === 'email') {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(value)) {
                isValid = false;
                errorMessage = 'Please enter a valid email address';
            }
        } else if (field.name === 'subject') {
            if (value.length < 3) {
                isValid = false;
                errorMessage = 'Subject must be at least 3 characters';
            }
        } else if (field.name === 'message') {
            if (value.length < 10) {
                isValid = false;
                errorMessage = 'Message must be at least 10 characters';
            }
        }
        
        if (!isValid) {
            showFieldError(field, errorMessage);
        } else {
            clearFieldError(field);
        }
        
        return isValid;
    }

    function showFieldError(field, message) {
        clearFieldError(field);
        field.classList.add('error');
        
        const errorElement = document.createElement('small');
        errorElement.className = 'field-error';
        errorElement.textContent = message;
        field.parentNode.insertBefore(errorElement, field.nextSibling);
    }

    function clearFieldError(field) {
        field.classList.remove('error');
        const error = field.parentNode.querySelector('.field-error');
        if (error) {
            error.remove();
        }
    }

    // ============================= 
    // Message Display
    // =============================
    function showMessage(type, message) {
        let messageContainer = document.querySelector('.form-message');
        
        if (!messageContainer) {
            messageContainer = document.createElement('div');
            messageContainer.className = 'form-message';
            contactForm.parentNode.insertBefore(messageContainer, contactForm);
        }
        
        messageContainer.className = `form-message form-message-${type}`;
        messageContainer.innerHTML = `
            <button class="message-close" type="button">&times;</button>
            <span>${message}</span>
        `;
        
        // Scroll to message
        messageContainer.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        
        // Close button
        messageContainer.querySelector('.message-close').addEventListener('click', () => {
            messageContainer.remove();
        });
        
        // Auto-remove error message after 5 seconds
        if (type === 'error') {
            setTimeout(() => {
                if (messageContainer.parentNode) {
                    messageContainer.remove();
                }
            }, 5000);
        }
    }
});
