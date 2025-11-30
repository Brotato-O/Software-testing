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
