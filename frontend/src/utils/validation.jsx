export const validateLogin = (username, password) => {
    const errors = {};

    if (!username || username.trim() === '') {
        errors.username = 'Username is required';
    }

    if (!password || password.trim() === '') {
        errors.password = 'Password is required';
    } else if (password.length < 6) {
        errors.password = 'Password must be at least 6 characters';
    }

    return {
        isValid: Object.keys(errors).length === 0,
        errors
    };
};

export const validateProduct = (product) => {
    const errors = {};

    if (!product.name || product.name.trim() === '') {
        errors.name = 'Product name is required';
    }

    if (!product.price || isNaN(product.price)) {
        errors.price = 'Valid price is required';
    } else if (product.price < 0) {
        errors.price = 'Price cannot be negative';
    }

    return {
        isValid: Object.keys(errors).length === 0,
        errors
    };
};