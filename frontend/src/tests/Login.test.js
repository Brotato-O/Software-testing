import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import Login from '../components/Login';
import * as api from '../services/api';

// Mock the api module
jest.mock('../services/api');

describe('Login Component', () => {
    const mockOnLoginSuccess = jest.fn();

    beforeEach(() => {
        // Clear all mocks before each test
        jest.clearAllMocks();
    });

    it('renders login form', () => {
        render(<Login onLoginSuccess={mockOnLoginSuccess} />);
        
        expect(screen.getByLabelText(/username/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /login/i })).toBeInTheDocument();
    });

    it('shows validation errors for empty fields', async () => {
        render(<Login onLoginSuccess={mockOnLoginSuccess} />);
        
        // Click login without entering any data
        fireEvent.click(screen.getByRole('button', { name: /login/i }));

        // Check for validation messages
        expect(await screen.findByText(/username is required/i)).toBeInTheDocument();
        expect(await screen.findByText(/password is required/i)).toBeInTheDocument();
    });

    it('shows error for short password', async () => {
        render(<Login onLoginSuccess={mockOnLoginSuccess} />);
        
        // Enter a short password
        fireEvent.change(screen.getByLabelText(/password/i), {
            target: { value: '12345' }
        });

        // Click login
        fireEvent.click(screen.getByRole('button', { name: /login/i }));

        // Check for validation message
        expect(await screen.findByText(/password must be at least 6 characters/i)).toBeInTheDocument();
    });

    it('calls api and onLoginSuccess when login is successful', async () => {
        // Mock successful login
        api.login.mockResolvedValueOnce({ message: 'Login successful' });

        render(<Login onLoginSuccess={mockOnLoginSuccess} />);
        
        // Fill in the form
        fireEvent.change(screen.getByLabelText(/username/i), {
            target: { value: 'testuser' }
        });
        fireEvent.change(screen.getByLabelText(/password/i), {
            target: { value: 'password123' }
        });

        // Submit the form
        fireEvent.click(screen.getByRole('button', { name: /login/i }));

        // Wait for the api call and success callback
        await waitFor(() => {
            expect(api.login).toHaveBeenCalledWith('testuser', 'password123');
            expect(mockOnLoginSuccess).toHaveBeenCalled();
        });
    });

    it('shows error message when login fails', async () => {
        // Mock failed login
        api.login.mockRejectedValueOnce({ message: 'Invalid credentials' });

        render(<Login onLoginSuccess={mockOnLoginSuccess} />);
        
        // Fill in the form
        fireEvent.change(screen.getByLabelText(/username/i), {
            target: { value: 'wronguser' }
        });
        fireEvent.change(screen.getByLabelText(/password/i), {
            target: { value: 'wrongpass' }
        });

        // Submit the form
        fireEvent.click(screen.getByRole('button', { name: /login/i }));

        // Check for error message
        expect(await screen.findByText(/invalid credentials/i)).toBeInTheDocument();
        expect(mockOnLoginSuccess).not.toHaveBeenCalled();
    });
});