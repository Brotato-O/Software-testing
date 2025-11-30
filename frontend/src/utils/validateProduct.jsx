// ========================================
// Câu 2.2: Product Validation Function
// ========================================

/**
 * Validate product according to requirements:
 * - Name: required, 3-100 characters
 * - Price: required, > 0, <= 1 billion
 * - Quantity: optional, if provided must be >= 0
 * - Description: optional, max 500 characters
 * - Category: required
 */
export const validateProduct = (product) => {
    const errors = {};

    // Validate name
    if (!product.name || product.name.trim() === '') {
        errors.name = 'Ten san pham khong duoc de trong';
    } else if (product.name.trim().length < 3) {
        errors.name = 'Ten san pham phai co it nhat 3 ky tu';
    } else if (product.name.trim().length > 100) {
        errors.name = 'Ten san pham khong duoc vuot qua 100 ky tu';
    }

    // Validate price
    if (product.price === null || product.price === undefined || product.price === '') {
        errors.price = 'Gia san pham khong duoc de trong';
    } else {
        const priceNum = Number(product.price);
        if (isNaN(priceNum)) {
            errors.price = 'Gia san pham phai la so';
        } else if (priceNum <= 0) {
            errors.price = 'Gia san pham phai lon hon 0';
        } else if (priceNum > 1000000000) {
            errors.price = 'Gia san pham khong duoc vuot qua 1 ty';
        }
    }

    // Validate quantity (optional, but if provided must be valid)
    if (product.quantity !== null && product.quantity !== undefined && product.quantity !== '') {
        const quantityNum = Number(product.quantity);
        if (isNaN(quantityNum)) {
            errors.quantity = 'So luong phai la so';
        } else if (quantityNum < 0) {
            errors.quantity = 'So luong phai lon hon hoac bang 0';
        }
    }

    // Validate description (optional, max 500 chars)
    if (product.description && product.description.length > 500) {
        errors.description = 'Mo ta khong duoc vuot qua 500 ky tu';
    }

    // Validate category
    if (!product.category || product.category.trim() === '') {
        errors.category = 'Danh muc khong duoc de trong';
    }

    return errors;
};