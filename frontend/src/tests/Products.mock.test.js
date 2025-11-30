import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import Products from "../components/Products";
import * as apiService from "../services/api";

jest.mock("../services/api");

describe("Product Mock Tests", () => {

    beforeEach(() => jest.clearAllMocks());

    test("Mock: Load products thành công", async () => {
        apiService.getProducts.mockResolvedValue([
            { id: 1, name: "Laptop", price: 1500 }
        ]);

        render(<Products />);

        await waitFor(() => {
            expect(apiService.getProducts).toHaveBeenCalledTimes(1);
            expect(screen.getByText("Laptop")).toBeInTheDocument();
        });
    });

    test("Mock: Create product thành công", async () => {
        apiService.getProducts.mockResolvedValue([]);
        apiService.createProduct.mockResolvedValue({
            id: 2,
            name: "New Product",
            price: 100
        });

        render(<Products />);

        fireEvent.change(screen.getByPlaceholderText("Enter product name"), {
            target: { value: "New Product" }
        });

        fireEvent.change(screen.getByPlaceholderText("0.00"), {
            target: { value: "100" }
        });

        fireEvent.click(screen.getByText("Add Product"));

        await waitFor(() => {
            expect(apiService.createProduct).toHaveBeenCalledTimes(1);
        });
    });

    test("Mock: Delete product thành công", async () => {
        apiService.getProducts.mockResolvedValue([
            { id: 1, name: "Laptop", price: 1500 }
        ]);

        apiService.deleteProduct.mockResolvedValue({});

        // auto-confirm window.confirm
        window.confirm = jest.fn(() => true);

        render(<Products />);

        await waitFor(() => {
            expect(screen.getByText("Laptop")).toBeInTheDocument();
        });

        fireEvent.click(screen.getByTitle("Delete"));

        await waitFor(() => {
            expect(apiService.deleteProduct).toHaveBeenCalledWith(1);
        });
    });
});
