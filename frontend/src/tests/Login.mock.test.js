import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import Login from "../components/Login";
import * as apiService from "../services/AuthService";

jest.mock("../services/AuthService");

describe("Login Mock Tests", () => {
    beforeEach(() => jest.clearAllMocks());

    test("Mock: Login thành công", async () => {
        apiService.login.mockResolvedValue({
            success: true,
            token: "mock-token-123"
        });

        const onLoginSuccess = jest.fn();

        render(<Login onLoginSuccess={onLoginSuccess} />);

        fireEvent.change(screen.getByPlaceholderText("Enter your username"), {
            target: { value: "testuser" }
        });

        fireEvent.change(screen.getByPlaceholderText("Enter your password"), {
            target: { value: "Abc123" } // ✔ valid password
        });

        fireEvent.click(screen.getByText("Sign In"));

        await waitFor(() => {
            expect(apiService.login).toHaveBeenCalledTimes(1);
            expect(apiService.login).toHaveBeenCalledWith("testuser", "Abc123");
            expect(onLoginSuccess).toHaveBeenCalled();
        });
    });

    test("Mock: Login thất bại", async () => {
        apiService.login.mockRejectedValue({
            message: "Invalid credentials"
        });

        render(<Login onLoginSuccess={() => {}} />);

        fireEvent.change(screen.getByPlaceholderText("Enter your username"), {
            target: { value: "wrong" }
        });

        fireEvent.change(screen.getByPlaceholderText("Enter your password"), {
            target: { value: "Abc123" } // ✔ VALID PASSWORD TO TRIGGER API
        });

        fireEvent.click(screen.getByText("Sign In"));

        await waitFor(() => {
            expect(apiService.login).toHaveBeenCalledTimes(1);
            expect(screen.getByText("Invalid credentials")).toBeInTheDocument();
        });
    });
});
