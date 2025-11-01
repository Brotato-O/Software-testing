// ========================================
// Câu 2.1: Frontend Validation Functions
// ========================================

/**
 * Validate username according to requirements:
 * - Required (not null, undefined, empty, or whitespace)
 * - Length: 3-50 characters
 * - Allowed chars: letters (a-zA-Z), numbers (0-9), dots (.), underscores (_), hyphens (-)
 * - Regex: /^[a-zA-Z0-9._-]{3,50}$/
 */
export const validateUsername = (username) => {
    // Check if username is null, undefined, empty, or whitespace
    if (!username || username.trim() === '') {
        return {
            isValid: false,
            error: 'Username is required'
        };
    }

    // Trim whitespace for validation
    const trimmedUsername = username.trim();

    // Check length (3-50 characters)
    if (trimmedUsername.length < 3 || trimmedUsername.length > 50) {
        return {
            isValid: false,
            error: 'Username must be between 3 and 50 characters'
        };
    }

    // Check allowed characters: letters, numbers, dots, underscores, hyphens
    const usernameRegex = /^[a-zA-Z0-9._-]+$/;
    if (!usernameRegex.test(trimmedUsername)) {
        return {
            isValid: false,
            error: 'Username can only contain letters, numbers, dots, underscores, and hyphens'
        };
    }

    return {
        isValid: true,
        error: ''
    };
};

/**
 * Validate password according to requirements:
 * - Required (not null, undefined, empty, or whitespace)
 * - Length: 6-100 characters
 * - Must contain both letters and numbers
 */
export const validatePassword = (password) => {
    // Check if password is null, undefined, empty, or whitespace
    if (!password || password.trim() === '') {
        return {
            isValid: false,
            error: 'Password is required'
        };
    }

    // Trim whitespace for validation
    const trimmedPassword = password.trim();

    // Check length (6-100 characters)
    if (trimmedPassword.length < 6 || trimmedPassword.length > 100) {
        return {
            isValid: false,
            error: 'Password must be between 6 and 100 characters'
        };
    }

    // Check if password contains both letters and numbers
    const hasLetter = /[a-zA-Z]/.test(trimmedPassword);
    const hasNumber = /[0-9]/.test(trimmedPassword);

    if (!hasLetter || !hasNumber) {
        return {
            isValid: false,
            error: 'Password must contain both letters and numbers'
        };
    }

    return {
        isValid: true,
        error: ''
    };
};