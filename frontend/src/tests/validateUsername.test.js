// ========================================
// Câu 2.1.1.a: Unit Tests cho validateUsername() (2 điểm)
// ========================================
// Áp dụng TDD (Test-Driven Development) approach

import { validateUsername } from '../utils/validation';

describe('validateUsername() - Unit Tests (2 điểm)', () => {

    // Test 1: Username rỗng
    describe('Test username rỗng', () => {
        it('should return error when username is empty', () => {
            const result = validateUsername('');
            expect(result.isValid).toBe(false);
            expect(result.error).toBe('Username is required');
        });

        it('should return error when username is null', () => {
            const result = validateUsername(null);
            expect(result.isValid).toBe(false);
            expect(result.error).toBe('Username is required');
        });

        it('should return error when username is only whitespace', () => {
            const result = validateUsername('   ');
            expect(result.isValid).toBe(false);
            expect(result.error).toBe('Username is required');
        });
    });

    // Test 2: Username quá ngắn/dài
    describe('Test username quá ngắn/dài', () => {
        it('should return error when username is too short (2 chars)', () => {
            const result = validateUsername('ab');
            expect(result.isValid).toBe(false);
            expect(result.error).toBe('Username must be between 3 and 50 characters');
        });

        it('should return error when username is too long (51 chars)', () => {
            const result = validateUsername('a'.repeat(51));
            expect(result.isValid).toBe(false);
            expect(result.error).toBe('Username must be between 3 and 50 characters');
        });

        it('should accept username with exactly 3 characters (boundary)', () => {
            const result = validateUsername('abc');
            expect(result.isValid).toBe(true);
            expect(result.error).toBe('');
        });

        it('should accept username with exactly 50 characters (boundary)', () => {
            const result = validateUsername('a'.repeat(50));
            expect(result.isValid).toBe(true);
            expect(result.error).toBe('');
        });
    });

    // Test 3: Ký tự đặc biệt không hợp lệ
    describe('Test ký tự đặc biệt không hợp lệ', () => {
        it('should return error when username contains space', () => {
            const result = validateUsername('test user');
            expect(result.isValid).toBe(false);
            expect(result.error).toBe('Username can only contain letters, numbers, dots, underscores, and hyphens');
        });

        it('should return error when username contains @ symbol', () => {
            const result = validateUsername('test@user');
            expect(result.isValid).toBe(false);
            expect(result.error).toBe('Username can only contain letters, numbers, dots, underscores, and hyphens');
        });

        it('should return error when username contains # symbol', () => {
            const result = validateUsername('test#user');
            expect(result.isValid).toBe(false);
            expect(result.error).toBe('Username can only contain letters, numbers, dots, underscores, and hyphens');
        });

        it('should return error when username contains special chars: !@#$%', () => {
            const result = validateUsername('test!@#$%');
            expect(result.isValid).toBe(false);
            expect(result.error).toBe('Username can only contain letters, numbers, dots, underscores, and hyphens');
        });
    });

    // Test 4: Username hợp lệ
    describe('Test username hợp lệ', () => {
        it('should accept username with letters and numbers', () => {
            const result = validateUsername('testuser123');
            expect(result.isValid).toBe(true);
            expect(result.error).toBe('');
        });

        it('should accept username with dots', () => {
            const result = validateUsername('test.user');
            expect(result.isValid).toBe(true);
            expect(result.error).toBe('');
        });

        it('should accept username with underscores', () => {
            const result = validateUsername('test_user');
            expect(result.isValid).toBe(true);
            expect(result.error).toBe('');
        });

        it('should accept username with hyphens', () => {
            const result = validateUsername('test-user');
            expect(result.isValid).toBe(true);
            expect(result.error).toBe('');
        });

        it('should accept username with mixed allowed characters', () => {
            const result = validateUsername('Test.User_123-ABC');
            expect(result.isValid).toBe(true);
            expect(result.error).toBe('');
        });
    });
});