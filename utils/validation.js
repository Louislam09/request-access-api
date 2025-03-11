const validator = require('validator');

const validateEmail = (email) => {
    if (!email || typeof email !== 'string') {
        return { isValid: false, error: 'Email is required' };
    }

    email = email.toLowerCase().trim();

    if (!validator.isEmail(email)) {
        return { isValid: false, error: 'Invalid email format' };
    }

    // Additional email validations
    if (email.length > 254) { // Maximum email length according to RFC 5321
        return { isValid: false, error: 'Email is too long' };
    }

    const [localPart] = email.split('@');
    if (localPart.length > 64) { // Maximum local part length
        return { isValid: false, error: 'Local part of email is too long' };
    }

    // Check for common disposable email domains
    const disposableDomains = ['tempmail.com', 'throwaway.com'];
    const domain = email.split('@')[1];
    if (disposableDomains.some(d => domain.includes(d))) {
        return { isValid: false, error: 'Disposable email addresses are not allowed' };
    }

    return { isValid: true, email };
};

const validateName = (name) => {
    if (!name || typeof name !== 'string') {
        return { isValid: false, error: 'Name is required' };
    }

    name = name.trim();

    if (name.length < 2) {
        return { isValid: false, error: 'Name is too short' };
    }

    if (name.length > 50) {
        return { isValid: false, error: 'Name is too long' };
    }

    // Allow letters, spaces, and common special characters in names
    if (!/^[a-zA-Z\s\-']+$/.test(name)) {
        return { isValid: false, error: 'Name contains invalid characters' };
    }

    return { isValid: true, name };
};

module.exports = {
    validateEmail,
    validateName
};
