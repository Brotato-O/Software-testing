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


