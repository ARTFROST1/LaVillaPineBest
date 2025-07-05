// Contact form functionality for the guest house website

class ContactForm {
    constructor(formElement) {
        this.form = formElement;
        this.fields = {};
        this.errors = {};
        this.isSubmitting = false;
        
        this.init();
    }
    
    init() {
        if (!this.form) return;
        
        this.collectFields();
        this.setupEventListeners();
        this.setupPhoneMask();
        this.setupDateValidation();
        
        console.log('Contact form initialized');
    }
    
    collectFields() {
        // Get all form fields
        this.fields = {
            name: this.form.querySelector('#name'),
            phone: this.form.querySelector('#phone'),
            email: this.form.querySelector('#email'),
            checkin: this.form.querySelector('#checkin'),
            checkout: this.form.querySelector('#checkout'),
            guests: this.form.querySelector('#guests'),
            subject: this.form.querySelector('#subject'),
            message: this.form.querySelector('#message'),
            privacy: this.form.querySelector('#privacy')
        };
        
        // Get error elements
        Object.keys(this.fields).forEach(fieldName => {
            const errorElement = this.form.querySelector(`#${fieldName}-error`);
            if (errorElement) {
                this.errors[fieldName] = errorElement;
            }
        });
    }
    
    setupEventListeners() {
        // Form submission
        this.form.addEventListener('submit', (e) => this.handleSubmit(e));
        
        // Real-time validation
        Object.keys(this.fields).forEach(fieldName => {
            const field = this.fields[fieldName];
            if (field) {
                field.addEventListener('blur', () => this.validateField(fieldName));
                field.addEventListener('input', () => this.clearFieldError(fieldName));
            }
        });
        
        // Date field dependencies
        if (this.fields.checkin) {
            this.fields.checkin.addEventListener('change', () => this.updateCheckoutMinDate());
        }
        
        // Phone number formatting
        if (this.fields.phone) {
            this.fields.phone.addEventListener('input', (e) => this.formatPhoneNumber(e));
        }
    }
    
    setupPhoneMask() {
        if (!this.fields.phone) return;
        
        // Set initial placeholder
        this.fields.phone.placeholder = '+7 (___) ___-__-__';
        
        // Handle phone number input
        this.fields.phone.addEventListener('input', (e) => {
            let value = e.target.value.replace(/\D/g, '');
            
            // Ensure it starts with 7 for Russian numbers
            if (value.length > 0 && !value.startsWith('7')) {
                value = '7' + value;
            }
            
            // Limit to 11 digits
            if (value.length > 11) {
                value = value.substring(0, 11);
            }
            
            // Format the number
            let formatted = '';
            if (value.length > 0) {
                formatted = '+7';
                if (value.length > 1) {
                    formatted += ' (' + value.substring(1, 4);
                    if (value.length > 4) {
                        formatted += ') ' + value.substring(4, 7);
                        if (value.length > 7) {
                            formatted += '-' + value.substring(7, 9);
                            if (value.length > 9) {
                                formatted += '-' + value.substring(9, 11);
                            }
                        }
                    }
                }
            }
            
            e.target.value = formatted;
        });
    }
    
    setupDateValidation() {
        // Set minimum date to today
        const today = new Date().toISOString().split('T')[0];
        if (this.fields.checkin) {
            this.fields.checkin.min = today;
        }
        if (this.fields.checkout) {
            this.fields.checkout.min = today;
        }
    }
    
    updateCheckoutMinDate() {
        if (!this.fields.checkin || !this.fields.checkout) return;
        
        const checkinDate = this.fields.checkin.value;
        if (checkinDate) {
            // Set checkout minimum to the day after checkin
            const checkinDateObj = new Date(checkinDate);
            checkinDateObj.setDate(checkinDateObj.getDate() + 1);
            const minCheckout = checkinDateObj.toISOString().split('T')[0];
            this.fields.checkout.min = minCheckout;
            
            // Clear checkout if it's before new minimum
            if (this.fields.checkout.value && this.fields.checkout.value <= checkinDate) {
                this.fields.checkout.value = '';
            }
        }
    }
    
    formatPhoneNumber(e) {
        // This is handled in setupPhoneMask, but we can add additional formatting here if needed
        this.validateField('phone');
    }
    
    validateField(fieldName) {
        const field = this.fields[fieldName];
        const errorElement = this.errors[fieldName];
        
        if (!field) return true;
        
        let isValid = true;
        let errorMessage = '';
        
        // Clear previous error
        this.clearFieldError(fieldName);
        
        // Skip validation for optional fields that are empty
        const requiredFields = ['name', 'phone', 'email', 'message', 'privacy'];
        if (!requiredFields.includes(fieldName) && !field.value.trim()) {
            return true;
        }
        
        switch (fieldName) {
            case 'name':
                if (!field.value.trim()) {
                    isValid = false;
                    errorMessage = 'Пожалуйста, введите ваше имя';
                } else if (field.value.trim().length < 2) {
                    isValid = false;
                    errorMessage = 'Имя должно содержать минимум 2 символа';
                } else if (!/^[а-яё\s\-\.]+$/i.test(field.value.trim()) && !/^[a-z\s\-\.]+$/i.test(field.value.trim())) {
                    isValid = false;
                    errorMessage = 'Имя должно содержать только буквы';
                }
                break;
                
            case 'phone':
                const phoneValue = field.value.replace(/\D/g, '');
                if (!phoneValue) {
                    isValid = false;
                    errorMessage = 'Пожалуйста, введите номер телефона';
                } else if (phoneValue.length !== 11 || !phoneValue.startsWith('7')) {
                    isValid = false;
                    errorMessage = 'Пожалуйста, введите корректный номер телефона';
                }
                break;
                
            case 'email':
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!field.value.trim()) {
                    isValid = false;
                    errorMessage = 'Пожалуйста, введите email адрес';
                } else if (!emailRegex.test(field.value.trim())) {
                    isValid = false;
                    errorMessage = 'Пожалуйста, введите корректный email адрес';
                }
                break;
                
            case 'checkin':
                if (field.value) {
                    const checkinDate = new Date(field.value);
                    const today = new Date();
                    today.setHours(0, 0, 0, 0);
                    
                    if (checkinDate < today) {
                        isValid = false;
                        errorMessage = 'Дата заезда не может быть в прошлом';
                    }
                }
                break;
                
            case 'checkout':
                if (field.value && this.fields.checkin && this.fields.checkin.value) {
                    const checkinDate = new Date(this.fields.checkin.value);
                    const checkoutDate = new Date(field.value);
                    
                    if (checkoutDate <= checkinDate) {
                        isValid = false;
                        errorMessage = 'Дата выезда должна быть позже даты заезда';
                    }
                }
                break;
                
            case 'message':
                if (!field.value.trim()) {
                    isValid = false;
                    errorMessage = 'Пожалуйста, введите сообщение';
                } else if (field.value.trim().length < 10) {
                    isValid = false;
                    errorMessage = 'Сообщение должно содержать минимум 10 символов';
                } else if (field.value.trim().length > 1000) {
                    isValid = false;
                    errorMessage = 'Сообщение не должно превышать 1000 символов';
                }
                break;
                
            case 'privacy':
                if (!field.checked) {
                    isValid = false;
                    errorMessage = 'Необходимо согласиться с политикой конфиденциальности';
                }
                break;
        }
        
        if (!isValid) {
            this.showFieldError(fieldName, errorMessage);
        }
        
        return isValid;
    }
    
    showFieldError(fieldName, message) {
        const field = this.fields[fieldName];
        const errorElement = this.errors[fieldName];
        
        if (field) {
            field.classList.add('error');
            field.setAttribute('aria-invalid', 'true');
        }
        
        if (errorElement) {
            errorElement.textContent = message;
            errorElement.style.display = 'block';
        }
    }
    
    clearFieldError(fieldName) {
        const field = this.fields[fieldName];
        const errorElement = this.errors[fieldName];
        
        if (field) {
            field.classList.remove('error');
            field.removeAttribute('aria-invalid');
        }
        
        if (errorElement) {
            errorElement.textContent = '';
            errorElement.style.display = 'none';
        }
    }
    
    validateForm() {
        let isValid = true;
        
        // Validate all required fields
        Object.keys(this.fields).forEach(fieldName => {
            if (!this.validateField(fieldName)) {
                isValid = false;
            }
        });
        
        return isValid;
    }
    
    async handleSubmit(e) {
        e.preventDefault();
        
        if (this.isSubmitting) return;
        
        // Validate form
        if (!this.validateForm()) {
            this.showFormError('Пожалуйста, исправьте ошибки в форме');
            return;
        }
        
        this.isSubmitting = true;
        this.showSubmittingState();
        
        try {
            const formData = this.collectFormData();
            const success = await this.submitForm(formData);
            
            if (success) {
                this.showSuccessMessage();
                this.resetForm();
            } else {
                this.showFormError('Произошла ошибка при отправке сообщения. Попробуйте еще раз.');
            }
        } catch (error) {
            console.error('Form submission error:', error);
            this.showFormError('Произошла ошибка при отправке сообщения. Пожалуйста, попробуйте позже или свяжитесь с нами по телефону.');
        } finally {
            this.isSubmitting = false;
            this.hideSubmittingState();
        }
    }
    
    collectFormData() {
        const data = {};
        
        Object.keys(this.fields).forEach(fieldName => {
            const field = this.fields[fieldName];
            if (field) {
                if (field.type === 'checkbox') {
                    data[fieldName] = field.checked;
                } else {
                    data[fieldName] = field.value.trim();
                }
            }
        });
        
        // Add timestamp
        data.timestamp = new Date().toISOString();
        
        // Clean phone number for submission
        if (data.phone) {
            data.phoneClean = data.phone.replace(/\D/g, '');
        }
        
        return data;
    }
    
    async submitForm(formData) {
        // In a real implementation, you would send this to your backend
        // For now, we'll simulate a successful submission
        
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        // Log form data for debugging (in production, send to server)
        console.log('Form submission data:', formData);
        
        // You would typically do something like:
        // const response = await fetch('/api/contact', {
        //     method: 'POST',
        //     headers: {
        //         'Content-Type': 'application/json',
        //     },
        //     body: JSON.stringify(formData)
        // });
        // return response.ok;
        
        // For demo purposes, randomly succeed/fail
        return Math.random() > 0.1; // 90% success rate
    }
    
    showSubmittingState() {
        const submitButton = this.form.querySelector('button[type="submit"]');
        if (submitButton) {
            submitButton.disabled = true;
            submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Отправляем...';
        }
        
        // Disable all form fields
        Object.keys(this.fields).forEach(fieldName => {
            const field = this.fields[fieldName];
            if (field) {
                field.disabled = true;
            }
        });
    }
    
    hideSubmittingState() {
        const submitButton = this.form.querySelector('button[type="submit"]');
        if (submitButton) {
            submitButton.disabled = false;
            submitButton.innerHTML = '<i class="fas fa-paper-plane"></i> Отправить сообщение';
        }
        
        // Re-enable all form fields
        Object.keys(this.fields).forEach(fieldName => {
            const field = this.fields[fieldName];
            if (field) {
                field.disabled = false;
            }
        });
    }
    
    showSuccessMessage() {
        const formContainer = this.form.parentNode;
        const successElement = document.getElementById('form-success');
        
        if (successElement) {
            this.form.style.display = 'none';
            successElement.classList.remove('hidden');
            
            // Scroll to success message
            successElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
            
            // Optional: Track success with analytics
            if (typeof gtag !== 'undefined') {
                gtag('event', 'form_submit', {
                    'form_name': 'contact_form'
                });
            }
        }
    }
    
    showFormError(message) {
        // Remove any existing error messages
        const existingError = this.form.querySelector('.form-error-message');
        if (existingError) {
            existingError.remove();
        }
        
        // Create error message element
        const errorDiv = document.createElement('div');
        errorDiv.className = 'form-error-message';
        errorDiv.style.cssText = `
            background-color: #f8d7da;
            color: #721c24;
            padding: 1rem;
            border-radius: 8px;
            margin-bottom: 1rem;
            border: 1px solid #f5c6cb;
        `;
        errorDiv.innerHTML = `<i class="fas fa-exclamation-triangle"></i> ${message}`;
        
        // Insert at the top of the form
        this.form.insertBefore(errorDiv, this.form.firstChild);
        
        // Scroll to error
        errorDiv.scrollIntoView({ behavior: 'smooth', block: 'center' });
        
        // Remove error after 5 seconds
        setTimeout(() => {
            if (errorDiv.parentNode) {
                errorDiv.remove();
            }
        }, 5000);
    }
    
    resetForm() {
        // Reset all fields
        Object.keys(this.fields).forEach(fieldName => {
            const field = this.fields[fieldName];
            if (field) {
                if (field.type === 'checkbox') {
                    field.checked = false;
                } else {
                    field.value = '';
                }
                this.clearFieldError(fieldName);
            }
        });
        
        // Reset date validation
        this.setupDateValidation();
    }
}

// Form character counter utility
function addCharacterCounter(textarea, maxLength) {
    const counter = document.createElement('div');
    counter.className = 'character-counter';
    counter.style.cssText = `
        text-align: right;
        font-size: 0.875rem;
        color: #6B6B6B;
        margin-top: 0.25rem;
    `;
    
    function updateCounter() {
        const currentLength = textarea.value.length;
        counter.textContent = `${currentLength}/${maxLength}`;
        
        if (currentLength > maxLength * 0.9) {
            counter.style.color = '#dc3545';
        } else if (currentLength > maxLength * 0.75) {
            counter.style.color = '#ffc107';
        } else {
            counter.style.color = '#6B6B6B';
        }
    }
    
    textarea.addEventListener('input', updateCounter);
    textarea.parentNode.appendChild(counter);
    updateCounter();
}

// Form accessibility enhancements
function enhanceFormAccessibility(form) {
    // Add ARIA labels and descriptions
    const fields = form.querySelectorAll('input, select, textarea');
    
    fields.forEach(field => {
        const label = form.querySelector(`label[for="${field.id}"]`);
        if (label && !field.getAttribute('aria-label')) {
            field.setAttribute('aria-label', label.textContent);
        }
        
        // Add required indicator for screen readers
        if (field.hasAttribute('required')) {
            const labelText = label ? label.textContent : field.getAttribute('aria-label') || '';
            field.setAttribute('aria-label', labelText + ' (обязательное поле)');
        }
    });
    
    // Improve error announcements
    const errorElements = form.querySelectorAll('[id$="-error"]');
    errorElements.forEach(errorElement => {
        errorElement.setAttribute('role', 'alert');
        errorElement.setAttribute('aria-live', 'polite');
    });
}

// Initialize contact forms when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    const contactForms = document.querySelectorAll('#contact-form');
    const formInstances = [];
    
    contactForms.forEach(form => {
        const instance = new ContactForm(form);
        formInstances.push(instance);
        
        // Enhance accessibility
        enhanceFormAccessibility(form);
        
        // Add character counter to message field
        const messageField = form.querySelector('#message');
        if (messageField) {
            addCharacterCounter(messageField, 1000);
        }
    });
    
    // Store instances globally
    window.contactFormInstances = formInstances;
    
    console.log('Contact forms initialized:', formInstances.length);
});

// Export for external use
window.ContactForm = ContactForm;
window.addCharacterCounter = addCharacterCounter;
window.enhanceFormAccessibility = enhanceFormAccessibility;
