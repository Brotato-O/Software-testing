// ========================================
// Câu 2.1.1.b: Unit Tests cho validatePassword() (2 điểm)
// ========================================
// Áp dụng TDD (Test-Driven Development) approach

import { validatePassword } from '../utils/validation';

describe('validatePassword() - Unit Tests (2 điểm)', () => {

    // Test 1: Password rỗng
    describe('Test password rỗng', () => {
        it('should return error when password is empty', () => {
            const result = validatePassword('');
            expect(result.isValid).toBe(false);
            expect(result.error).toBe('Password is required');
        });

        it('should return error when password is null', () => {
            const result = validatePassword(null);
            expect(result.isValid).toBe(false);
            expect(result.error).toBe('Password is required');
        });

        it('should return error when password is only whitespace', () => {
            const result = validatePassword('   ');
            expect(result.isValid).toBe(false);
            expect(result.error).toBe('Password is required');
        });
    });

    // Test 2: Password quá ngắn/dài
    describe('Test password quá ngắn/dài', () => {
        it('should return error when password is too short (5 chars)', () => {
            const result = validatePassword('Test1');
            expect(result.isValid).toBe(false);
            expect(result.error).toBe('Password must be between 6 and 100 characters');
        });

        it('should return error when password is too long (101 chars)', () => {
            const longPassword = 'Test1' + 'a'.repeat(96); // 101 chars
            const result = validatePassword(longPassword);
            expect(result.isValid).toBe(false);
            expect(result.error).toBe('Password must be between 6 and 100 characters');
        });

        it('should accept password with exactly 6 characters (boundary)', () => {
            const result = validatePassword('Test12');
            expect(result.isValid).toBe(true);
            expect(result.error).toBe('');
        });

        it('should accept password with exactly 100 characters (boundary)', () => {
            const password100 = 'Test1' + 'a'.repeat(95); // 100 chars
            const result = validatePassword(password100);
            expect(result.isValid).toBe(true);
            expect(result.error).toBe('');
        });
    });

    // Test 3: Password không có chữ hoặc số
    describe('Test password không có chữ hoặc số', () => {
        it('should return error when password contains only numbers', () => {
            const result = validatePassword('123456');
            expect(result.isValid).toBe(false);
            expect(result.error).toBe('Password must contain both letters and numbers');
        });

        it('should return error when password contains only letters', () => {
            const result = validatePassword('TestPass');
            expect(result.isValid).toBe(false);
            expect(result.error).toBe('Password must contain both letters and numbers');
        });

        it('should return error when password contains letters and special chars only', () => {
            const result = validatePassword('Test!@#');
            expect(result.isValid).toBe(false);
            expect(result.error).toBe('Password must contain both letters and numbers');
        });

        it('should return error when password contains numbers and special chars only', () => {
            const result = validatePassword('123!@#');
            expect(result.isValid).toBe(false);
            expect(result.error).toBe('Password must contain both letters and numbers');
        });
    });

    // Test 4: Password hợp lệ
    describe('Test password hợp lệ', () => {
        it('should accept password with lowercase letters and numbers', () => {
            const result = validatePassword('test123');
            expect(result.isValid).toBe(true);
            expect(result.error).toBe('');
        });

        it('should accept password with uppercase letters and numbers', () => {
            const result = validatePassword('TEST123');
            expect(result.isValid).toBe(true);
            expect(result.error).toBe('');
        });

        it('should accept password with mixed case letters and numbers', () => {
            const result = validatePassword('Test123');
            expect(result.isValid).toBe(true);
            expect(result.error).toBe('');
        });

        it('should accept password with letters, numbers, and special chars', () => {
            const result = validatePassword('Test123!@#');
            expect(result.isValid).toBe(true);
            expect(result.error).toBe('');
        });

        it('should accept password with minimum valid format (6 chars)', () => {
            const result = validatePassword('Test12');
            expect(result.isValid).toBe(true);
            expect(result.error).toBe('');
        });
    });
});