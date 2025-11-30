/**
 * Câu 2.2: Frontend Unit Tests - Product Validation (5 điểm)
 * Test cho validateProduct() function
 */

import { validateProduct } from '../utils/validateProduct';

describe('Product Validation Tests', () => {
    // ========================================
    // 1. Test product name validation
    // Kiểm tra các trường hợp cho tên sản phẩm: rỗng, null, ngắn, dài, hợp lệ
    // ========================================
    // Test Product Name Validation
    // ========================================

    test('TC1: Product name rong - nen tra ve loi', () => {
        const product = {
            name: '',
            price: 1000,
            quantity: 10
        };
        const errors = validateProduct(product);

        expect(errors.name).toBe('Ten san pham khong duoc de trong');
    });

    test('TC2: Product name null - nen tra ve loi', () => {
        const product = {
            name: null,
            price: 1000,
            quantity: 10,
            category: 'Electronics'
        };
        const errors = validateProduct(product);

        expect(errors.name).toBe('Ten san pham khong duoc de trong');
    });

    test('TC3: Product name qua ngan - nen tra ve loi', () => {
        const product = {
            name: 'AB',
            price: 1000,
            quantity: 10,
            category: 'Electronics'
        };
        const errors = validateProduct(product);

        expect(errors.name).toBe('Ten san pham phai co it nhat 3 ky tu');
    });

    test('TC4: Product name qua dai - nen tra ve loi', () => {
        const product = {
            name: 'A'.repeat(101),
            price: 1000,
            quantity: 10,
            category: 'Electronics'
        };
        const errors = validateProduct(product);

        expect(errors.name).toBe('Ten san pham khong duoc vuot qua 100 ky tu');
    });

    test('TC5: Product name hop le - khong co loi', () => {
        const product = {
            name: 'Laptop Dell',
            price: 1000,
            quantity: 10,
            category: 'Electronics'
        };
        const errors = validateProduct(product);

        expect(errors.name).toBeUndefined();
    });

    // ========================================
    // 2. Test price validation (boundary tests)
    // Kiểm tra các trường hợp cho giá sản phẩm: âm, 0, lớn hơn 1 tỷ, rỗng, không phải số, hợp lệ

    test('TC6: Price am - nen tra ve loi', () => {
        const product = {
            name: 'Laptop',
            price: -1000,
            quantity: 10,
            category: 'Electronics'
        };
        const errors = validateProduct(product);

        expect(errors.price).toBe('Gia san pham phai lon hon 0');
    });

    test('TC7: Price bang 0 - nen tra ve loi', () => {
        const product = {
            name: 'Laptop',
            price: 0,
            quantity: 10,
            category: 'Electronics'
        };
        const errors = validateProduct(product);

        expect(errors.price).toBe('Gia san pham phai lon hon 0');
    });

    test('TC8: Price = 1 (boundary) - hop le', () => {
        const product = {
            name: 'Laptop',
            price: 1,
            quantity: 10,
            category: 'Electronics'
        };
        const errors = validateProduct(product);

        expect(errors.price).toBeUndefined();
    });

    test('TC9: Price vuot qua 1 ty - nen tra ve loi', () => {
        const product = {
            name: 'Laptop',
            price: 1000000001,
            quantity: 10,
            category: 'Electronics'
        };
        const errors = validateProduct(product);

        expect(errors.price).toBe('Gia san pham khong duoc vuot qua 1 ty');
    });

    test('TC10: Price = 1 ty (boundary) - hop le', () => {
        const product = {
            name: 'Laptop',
            price: 1000000000,
            quantity: 10,
            category: 'Electronics'
        };
        const errors = validateProduct(product);

        expect(errors.price).toBeUndefined();
    });

    test('TC11: Price rong - nen tra ve loi', () => {
        const product = {
            name: 'Laptop',
            price: '',
            quantity: 10,
            category: 'Electronics'
        };
        const errors = validateProduct(product);

        expect(errors.price).toBe('Gia san pham khong duoc de trong');
    });

    test('TC12: Price khong phai so - nen tra ve loi', () => {
        const product = {
            name: 'Laptop',
            price: 'abc',
            quantity: 10,
            category: 'Electronics'
        };
        const errors = validateProduct(product);

        expect(errors.price).toBe('Gia san pham phai la so');
    });

    // ========================================
    // 3. Test quantity validation
    // Kiểm tra các trường hợp cho số lượng sản phẩm: âm, 0, không phải số, rỗng, hợp lệ

    test('TC13: Quantity am - nen tra ve loi', () => {
        const product = {
            name: 'Laptop',
            price: 1000,
            quantity: -5,
            category: 'Electronics'
        };
        const errors = validateProduct(product);

        expect(errors.quantity).toBe('So luong phai lon hon hoac bang 0');
    });

    test('TC14: Quantity = 0 (boundary) - hop le', () => {
        const product = {
            name: 'Laptop',
            price: 1000,
            quantity: 0,
            category: 'Electronics'
        };
        const errors = validateProduct(product);

        expect(errors.quantity).toBeUndefined();
    });

    test('TC15: Quantity khong phai so - nen tra ve loi', () => {
        const product = {
            name: 'Laptop',
            price: 1000,
            quantity: 'abc',
            category: 'Electronics'
        };
        const errors = validateProduct(product);

        expect(errors.quantity).toBe('So luong phai la so');
    });

    test('TC16: Quantity rong (optional) - hop le', () => {
        const product = {
            name: 'Laptop',
            price: 1000,
            quantity: '',
            category: 'Electronics'
        };
        const errors = validateProduct(product);

        expect(errors.quantity).toBeUndefined();
    });

    // ========================================
    // 4. Test description length
    // Kiểm tra các trường hợp cho mô tả sản phẩm: quá dài, hợp lệ, rỗng

    test('TC17: Description qua dai - nen tra ve loi', () => {
        const product = {
            name: 'Laptop',
            price: 1000,
            quantity: 10,
            description: 'A'.repeat(501),
            category: 'Electronics'
        };
        const errors = validateProduct(product);

        expect(errors.description).toBe('Mo ta khong duoc vuot qua 500 ky tu');
    });

    test('TC18: Description = 500 ky tu (boundary) - hop le', () => {
        const product = {
            name: 'Laptop',
            price: 1000,
            quantity: 10,
            description: 'A'.repeat(500),
            category: 'Electronics'
        };
        const errors = validateProduct(product);

        expect(errors.description).toBeUndefined();
    });

    test('TC19: Description rong (optional) - hop le', () => {
        const product = {
            name: 'Laptop',
            price: 1000,
            quantity: 10,
            description: '',
            category: 'Electronics'
        };
        const errors = validateProduct(product);

        expect(errors.description).toBeUndefined();
    });

    // ========================================
    // 5. Test category validation
    // Kiểm tra các trường hợp cho danh mục sản phẩm: rỗng, null, hợp lệ

    test('TC20: Category rong - nen tra ve loi', () => {
        const product = {
            name: 'Laptop',
            price: 1000,
            quantity: 10,
            category: ''
        };
        const errors = validateProduct(product);

        expect(errors.category).toBe('Danh muc khong duoc de trong');
    });

    test('TC21: Category null - nen tra ve loi', () => {
        const product = {
            name: 'Laptop',
            price: 1000,
            quantity: 10,
            category: null
        };
        const errors = validateProduct(product);

        expect(errors.category).toBe('Danh muc khong duoc de trong');
    });

    test('TC22: Category hop le - khong co loi', () => {
        const product = {
            name: 'Laptop',
            price: 1000,
            quantity: 10,
            category: 'Electronics'
        };
        const errors = validateProduct(product);

        expect(errors.category).toBeUndefined();
    });

    // ========================================
    // Test Product hop le - khong co loi
    // ========================================

    test('TC23: Product hop le - khong co loi', () => {
        const product = {
            name: 'Laptop Dell',
            price: 15000000,
            quantity: 10,
            category: 'Electronics'
        };
        const errors = validateProduct(product);

        expect(Object.keys(errors).length).toBe(0);
    });

    test('TC24: Product hop le voi description - khong co loi', () => {
        const product = {
            name: 'Laptop Dell XPS 13',
            price: 25000000,
            quantity: 5,
            description: 'Laptop cao cap, man hinh 13 inch, RAM 16GB, SSD 512GB',
            category: 'Electronics'
        };
        const errors = validateProduct(product);

        expect(Object.keys(errors).length).toBe(0);
    });

});
