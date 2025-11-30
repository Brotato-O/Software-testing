import {render, screen, fireEvent, waitFor} from '@testing-library/react';
import '@testing-library/jest-dom';
import axios from 'axios';
import Login from '../components/Login';
import * as apiModule from '../services/api';

jest.mock('../services/api');

jest.mock('axios');

describe('Login Component', () => {

    //kiểm tra không nhập
    test ('Emty input fileds', async ()=>{
        axios.post.mockResolvedValueOnce({ data: { success: true } });
        const mockSuccess = jest.fn();
        render(<Login onLoginSuccess={mockSuccess} />); 
        
        const submitButton = screen.getByRole('button');
        fireEvent.click(submitButton);

        const usernameError = await screen.findByText('Username is required');
        const passwordError = await screen.findByText('Password is required');

        await waitFor(() => {
            expect(usernameError).toBeInTheDocument();
            expect(passwordError).toBeInTheDocument();
        })
    })

    //kiểm tra nhập thiếu độ dài
    test ('Invalid input fields', async ()=>{
        const mockSuccess = jest.fn();
        render(<Login onLoginSuccess={mockSuccess} />); 

        const usernameInput = screen.getByLabelText('Username');
        const passwordInput = screen.getByLabelText('Password');
        const submitButton = screen.getByRole('button');

        fireEvent.change(usernameInput, {target: {value: 'he'}});
        fireEvent.change(passwordInput, {target: {value: 'ss'}});
        fireEvent.click(submitButton);

        const usernameError = await screen.findByText('Username must be between 3 and 50 characters');
        const passwordError = await screen.findByText('Password must be between 6 and 100 characters');

        expect(usernameError).toBeInTheDocument();
        expect(passwordError).toBeInTheDocument();
    });

    //kiểm tra nhập kí tự đặc biệt
    test ('Invalid special characters in username', async ()=>{
        const mockSuccess = jest.fn();
        render(<Login onLoginSuccess={mockSuccess} />); 

        const usernameInput = screen.getByLabelText('Username');
        const passwordInput = screen.getByLabelText('Password');
        const submitButton = screen.getByRole('button');

        fireEvent.change(usernameInput, {target: {value: 'test@user'}});
        fireEvent.change(passwordInput, {target: {value: 'Test1234'}});
        fireEvent.click(submitButton);

        const usernameError = await screen.findByText('Username can only contain letters, numbers, dots, underscores, and hyphens');
        const passwordError = screen.queryByText('Password must contain both letters and numbers');

        expect(usernameError).toBeInTheDocument();
    });

    //kiểm tra nhập đúng
    test ('Valid input fields', async ()=>{
        const mockSuccess = jest.fn();
        render(<Login onLoginSuccess={mockSuccess} />); 

        const usernameInput = screen.getByLabelText('Username');
        const passwordInput = screen.getByLabelText('Password');
        const submitButton = screen.getByRole('button');

        fireEvent.change(usernameInput, {target: {value: 'testuser'}});
        fireEvent.change(passwordInput, {target: {value: 'Test1234'}});
        fireEvent.click(submitButton);
        
        await waitFor(() => {
            expect(screen.queryByText('Username is required')).not.toBeInTheDocument();
            expect(screen.queryByText('Password is required')).not.toBeInTheDocument();
            expect(screen.queryByText('Username must be between 3 and 50 characters')).not.toBeInTheDocument();
            expect(screen.queryByText('Password must be between 6 and 100 characters')).not.toBeInTheDocument();
            expect(screen.queryByText('Username can only contain letters, numbers, dots, underscores, and hyphens')).not.toBeInTheDocument();
            expect(screen.queryByText('Password must contain both letters and numbers')).not.toBeInTheDocument();
        });
    });

    //kiểm tra đăng nhập thất bại
    test ('Login failed from server', async ()=>{
        apiModule.login.mockRejectedValueOnce({ message: 'An error occurred' });
        const mockOnLoginSuccess = jest.fn();
        const mockLogin= jest.spyOn(apiModule, 'login');
        render(<Login onLoginSuccess={mockOnLoginSuccess} />);

        const usernameInput = screen.getByLabelText('Username');
        const passwordInput = screen.getByLabelText('Password');
        const submitButton = screen.getByRole('button');

        fireEvent.change(usernameInput, {target: {value: 'wronguser'}});
        fireEvent.change(passwordInput, {target: {value: 'WrongPass123'}});
        fireEvent.click(submitButton);

        const serverError = await screen.findByText('An error occurred');
        await waitFor(() => {
            expect(mockLogin).toHaveBeenCalledWith('wronguser', 'WrongPass123');
            expect(serverError).toBeInTheDocument()
        });
    });

    //kiểm tra đăng nhập thành công
    test ('Login successful from server', async ()=>{
        apiModule.login.mockResolvedValueOnce({data: { success: true } });
        const mockOnLoginSuccess = jest.fn();
        const mockLogin= jest.spyOn(apiModule, 'login');
        render(<Login onLoginSuccess={mockOnLoginSuccess} />);

        const usernameInput = screen.getByLabelText('Username');
        const passwordInput = screen.getByLabelText('Password');
        const submitButton = screen.getByRole('button');

        fireEvent.change(usernameInput, {target: {value: 'correctuser'}});
        fireEvent.change(passwordInput, {target: {value: 'CorrectPass123'}});
        fireEvent.click(submitButton);

        await waitFor(() => {
            expect(mockLogin).toHaveBeenCalledWith('correctuser', 'CorrectPass123');
            expect(mockOnLoginSuccess).toHaveBeenCalled();
        });
    });
})