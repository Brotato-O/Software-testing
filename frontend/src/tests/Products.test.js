import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import Products from '../components/Products';
import * as api from '../services/api';

// Mock the api module
jest.mock('../services/api');

describe('Products Component', () => {
    const mockProducts = [
        { id: 1, name: 'Test Product 1', description: 'Description 1', price: 99.99 },
        { id: 2, name: 'Test Product 2', description: 'Description 2', price: 149.99 }
    ];

    beforeEach(() => {
        jest.clearAllMocks();
        // Mock successful products fetch by default
        api.getProducts.mockResolvedValue(mockProducts);
    });

    it('renders products list and form', async () => {
        render(<Products />);

        // Wait for products to load
        await waitFor(() => {
            expect(screen.getByText('Test Product 1')).toBeInTheDocument();
            expect(screen.getByText('Test Product 2')).toBeInTheDocument();
        });

        // Check form elements
        expect(screen.getByLabelText(/name/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/price/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/description/i)).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /add product/i })).toBeInTheDocument();
    });

    it('shows validation errors for empty required fields', async () => {
        render(<Products />);

        // Try to submit empty form
        fireEvent.click(screen.getByRole('button', { name: /add product/i }));

        // Check for validation messages
        expect(await screen.findByText(/product name is required/i)).toBeInTheDocument();
        expect(await screen.findByText(/valid price is required/i)).toBeInTheDocument();
    });

    it('creates new product successfully', async () => {
        const newProduct = {
            id: 3,
            name: 'New Product',
            description: 'New Description',
            price: 199.99
        };

        api.createProduct.mockResolvedValueOnce(newProduct);
        
        render(<Products />);

        // Fill in the form
        fireEvent.change(screen.getByLabelText(/name/i), {
            target: { value: 'New Product' }
        });
        fireEvent.change(screen.getByLabelText(/description/i), {
            target: { value: 'New Description' }
        });
        fireEvent.change(screen.getByLabelText(/price/i), {
            target: { value: '199.99' }
        });

        // Submit the form
        fireEvent.click(screen.getByRole('button', { name: /add product/i }));

        // Verify api call and UI update
        await waitFor(() => {
            expect(api.createProduct).toHaveBeenCalledWith({
                name: 'New Product',
                description: 'New Description',
                price: 199.99
            });
            expect(api.getProducts).toHaveBeenCalled();
        });
    });

    it('updates product successfully', async () => {
        const updatedProduct = {
            id: 1,
            name: 'Updated Product',
            description: 'Updated Description',
            price: 299.99
        };

        api.updateProduct.mockResolvedValueOnce(updatedProduct);
        
        render(<Products />);

        // Wait for products to load and click edit
        await waitFor(() => {
            fireEvent.click(screen.getAllByText(/edit/i)[0]);
        });

        // Fill in the form with updated values
        fireEvent.change(screen.getByLabelText(/name/i), {
            target: { value: 'Updated Product' }
        });
        fireEvent.change(screen.getByLabelText(/description/i), {
            target: { value: 'Updated Description' }
        });
        fireEvent.change(screen.getByLabelText(/price/i), {
            target: { value: '299.99' }
        });

        // Submit the form
        fireEvent.click(screen.getByRole('button', { name: /update product/i }));

        // Verify api call
        await waitFor(() => {
            expect(api.updateProduct).toHaveBeenCalledWith(1, {
                name: 'Updated Product',
                description: 'Updated Description',
                price: 299.99
            });
            expect(api.getProducts).toHaveBeenCalled();
        });
    });

    it('deletes product after confirmation', async () => {
        // Mock window.confirm
        const mockConfirm = jest.spyOn(window, 'confirm');
        mockConfirm.mockImplementation(() => true);

        api.deleteProduct.mockResolvedValueOnce();
        
        render(<Products />);

        // Wait for products to load and click delete
        await waitFor(() => {
            fireEvent.click(screen.getAllByText(/delete/i)[0]);
        });

        // Verify api calls
        await waitFor(() => {
            expect(api.deleteProduct).toHaveBeenCalledWith(1);
            expect(api.getProducts).toHaveBeenCalled();
        });

        // Cleanup
        mockConfirm.mockRestore();
    });

    it('does not delete product when confirmation is cancelled', async () => {
        // Mock window.confirm to return false
        const mockConfirm = jest.spyOn(window, 'confirm');
        mockConfirm.mockImplementation(() => false);

        render(<Products />);

        // Wait for products to load and click delete
        await waitFor(() => {
            fireEvent.click(screen.getAllByText(/delete/i)[0]);
        });

        // Verify api was not called
        expect(api.deleteProduct).not.toHaveBeenCalled();

        // Cleanup
        mockConfirm.mockRestore();
    });
});