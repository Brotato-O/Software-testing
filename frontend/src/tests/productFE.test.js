import '@testing-library/jest-dom';
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import Products from "../components/Products";
import * as apiModule from "../services/ProductService"; // mock API
jest.mock('../services/ProductService', () => ({
    getProducts: jest.fn(),
    createProduct: jest.fn(),
    updateProduct: jest.fn(),
    deleteProduct: jest.fn(),
}));

describe("ProductList Component Integration", () => {
    // Test tải và hiển thị danh sách sản phẩm từ API
    test("loads and displays product list from API", async () => {
        // Fake data trả về từ API
        const mockProducts = [
            { id: 1, name: "Laptop", description: "Gaming laptop", price: 1000 },
            { id: 2, name: "Mouse", description: "Wireless mouse", price: 25 },
        ];

        // Mock getProducts() trả về fake data
        jest.spyOn(apiModule, "getProducts").mockResolvedValue(mockProducts);

        const mockOnLogout = jest.fn();
        render(<Products onLogout={mockOnLogout} />);

        // Kiểm tra API gọi đúng 1 lần
        expect(apiModule.getProducts).toHaveBeenCalledTimes(1);

        // Đợi dữ liệu được load và hiển thị
        expect(await screen.findByText("Laptop")).toBeInTheDocument();
        expect(await screen.getByText("Mouse")).toBeInTheDocument();

        // Kiểm tra số lượng card được render
        const productCards = screen.getAllByText(/\$/); // tìm theo ký hiệu giá
        expect(productCards.length).toBe(4); //2 sản phẩm, còn 2 kí tự trong add
    });

    test ("handle empty product list", async ()=>{
        // Mock getProducts() trả về mảng rỗng
        jest.spyOn(apiModule, "getProducts").mockResolvedValue([]);
        const mockOnLogout = jest.fn();
        render(<Products onLogout={mockOnLogout} />);
        const noProductsText = await screen.findByText('No products yet');
        expect(noProductsText).toBeInTheDocument();
    });

    test("handle API error on loading products", async () => {
    // Mock console.error
    const consoleSpy = jest.spyOn(console, "error").mockImplementation(() => {});

    // Mock API lỗi
    jest.spyOn(apiModule, "getProducts").mockRejectedValue(new Error("Failed to fetch products"));

    const mockOnLogout = jest.fn();
    render(<Products onLogout={mockOnLogout} />);

    // Chờ loadProducts chạy xong
    await waitFor(() => {
        expect(consoleSpy).toHaveBeenCalledWith(
            "Failed to load products:",
            expect.any(Error)
        );
    });

    // Khôi phục console
    consoleSpy.mockRestore();
});


    // Test tạo sản phẩm mới với unvalid data
    test("create new products with empty name", async () => {
        const mockOnLogout = jest.fn();
        render(<Products onLogout={mockOnLogout} />);
        const addBtn = screen.getByRole('button', { name: "Add Product" });
        fireEvent.click(addBtn);

        const error = await screen.findByText('Ten san pham khong duoc de trong');
        expect(error).toBeInTheDocument();
    })

    test("create new products with short name", async () => {
        const mockOnLogout = jest.fn();
        render(<Products onLogout={mockOnLogout} />);

        const addBtn = screen.getByRole('button', { name: "Add Product" });
        const nameInput = screen.getByLabelText('Product Name *');

        fireEvent.change(nameInput, { target: { value: 'ab' } }); //tên quá ngắn
        fireEvent.click(addBtn);

        const nameError = await screen.findByText('Ten san pham phai co it nhat 3 ky tu');
        expect(nameError).toBeInTheDocument();
    });

    test("create new products with empty price", async () => {
        const mockOnLogout = jest.fn();
        render(<Products onLogout={mockOnLogout} />);

        const addBtn = screen.getByRole('button', { name: "Add Product" });
        const nameInput = screen.getByLabelText('Product Name *');
        const priceInput = screen.getByLabelText('Price ($) *');

        fireEvent.change(nameInput, { target: { value: 'Valid Product' } });
        fireEvent.change(priceInput, { target: { value: '' } });
        fireEvent.click(addBtn);

        const priceError = await screen.findByText('Gia san pham khong duoc de trong');
        expect(priceError).toBeInTheDocument();
    });

    test("create new products with negative price", async () => {
        const mockOnLogout = jest.fn();
        render(<Products onLogout={mockOnLogout} />);

        const addBtn = screen.getByRole('button', { name: "Add Product" });
        const nameInput = screen.getByLabelText('Product Name *');
        const priceInput = screen.getByLabelText('Price ($) *');

        fireEvent.change(nameInput, { target: { value: 'Valid Product' } });
        fireEvent.change(priceInput, { target: { value: -10 } });
        fireEvent.click(addBtn);

        const priceError = await screen.findByText('Gia san pham phai lon hon 0');
        expect(priceError).toBeInTheDocument();
    });

    //test tạo sản phẩm mới với valid data
    test("Create new products with valid data", async () => {
        // Mock API trước khi thực hiện submit
        apiModule.createProduct.mockResolvedValue({
            id: 1,
            name: "New Product",
            price: 50
        });

        apiModule.getProducts.mockResolvedValue([
            { id: 1, name: "New Product", price: 50 }
        ]);

        const mockOnLogout = jest.fn();
        render(<Products onLogout={mockOnLogout} />);

        const addBtn = screen.getByRole('button', { name: "Add Product" });
        const nameInput = screen.getByLabelText('Product Name *');
        const priceInput = screen.getByLabelText('Price ($) *');

        fireEvent.change(nameInput, { target: { value: 'New Product' } });
        fireEvent.change(priceInput, { target: { value: 50 } });
        fireEvent.click(addBtn);

        // Kiểm tra UI
        const newProduct = await screen.findByText('New Product');
        expect(newProduct).toBeInTheDocument();
    });

    //test edit sản phẩm với unvalid data
    test("edit product with invalid data", async () => {
        const mockProducts = [
            { id: 1, name: "Laptop", description: "Gaming laptop", price: 1000 },
        ];
        jest.spyOn(apiModule, "getProducts").mockResolvedValue(mockProducts);
        const mockOnLogout = jest.fn();
        render(<Products onLogout={mockOnLogout} />);

        const editBtn = await screen.findByTitle('Edit');
        fireEvent.click(editBtn);
        const nameInput = screen.getByLabelText('Product Name *');
        const priceInput = screen.getByLabelText('Price ($) *');
        fireEvent.change(nameInput, {
            target: {
                value: ''
            }
        }); //tên để trống
        fireEvent.change(priceInput, { target: { value: '' } });

        const saveBtn = screen.getByRole('button', { name: /Update Product/i });
        fireEvent.click(saveBtn);

        const nameError = await screen.findByText('Ten san pham khong duoc de trong');
        const priceError = await screen.findByText('Gia san pham khong duoc de trong');
        expect(nameError).toBeInTheDocument();
        expect(priceError).toBeInTheDocument();
    });

    //test edit sản phẩm với valid data
    test("edit product with valid data", async () => {
        const mockProducts = [
            { id: 1, name: "Laptop", description: "Gaming laptop", price: 1000 },
        ];
        jest.spyOn(apiModule, "getProducts").mockResolvedValue(mockProducts);
        // Mock API trước khi thực hiện submit
        jest.spyOn(apiModule, "updateProduct").mockResolvedValue({
            id: 1,
            name: "Updated Laptop",
            description: "Gaming laptop",
            price: 1000
        });
        apiModule.getProducts.mockResolvedValue([
            { id: 1, name: "Updated Laptop", price: 1000 }
        ]);

        const mockOnLogout = jest.fn();
        render(<Products onLogout={mockOnLogout} />);

        const editBtn = await screen.findByTitle('Edit');
        fireEvent.click(editBtn);
        const nameInput = screen.getByLabelText('Product Name *');
        fireEvent.change(nameInput, { target: { value: 'Updated Laptop' } });

        const saveBtn = screen.getByRole('button', { name: /Update Product/i });
        fireEvent.click(saveBtn);

        // Kiểm tra UI

        const updatedProduct = await screen.findByText('Updated Laptop');
        expect(updatedProduct).toBeInTheDocument();
    });

    //test xóa sản phẩm
    test("delete product", async () => {
        const mockProducts = [
            { id: 1, name: "Laptop", description: "Gaming laptop", price: 1000 },
        ];

        // Mock API
        jest.spyOn(apiModule, "getProducts").mockResolvedValue(mockProducts);
        jest.spyOn(apiModule, "deleteProduct").mockResolvedValue({});

        // Mock confirm để trả về true (xác nhận xóa)
        jest.spyOn(window, "confirm").mockImplementation(() => true);

        const mockOnLogout = jest.fn();
        render(<Products onLogout={mockOnLogout} />);

        // Chờ sản phẩm render
        const deleteBtn = await screen.findByTitle('Delete');
        fireEvent.click(deleteBtn);

        // Sau khi xóa, mock getProducts trả về rỗng
        apiModule.getProducts.mockResolvedValue([]);

        // Chờ UI cập nhật
        const noProducts = await screen.findByText('No products yet');
        expect(noProducts).toBeInTheDocument();

        // Cleanup confirm mock
        window.confirm.mockRestore();
    });

    //test detail product
    test("view product details", async () => {
        const mockProducts = [
            { id: 1, name: "Laptop", description: "Gaming laptop", price: 1000 },
        ];
        jest.spyOn(apiModule, "getProducts").mockResolvedValue(mockProducts);
        const mockOnLogout = jest.fn();
        render(<Products onLogout={mockOnLogout} />);
        const detailText = await screen.findByText('Gaming laptop');
        expect(detailText).toBeInTheDocument();
    });

    test("view empty product details", async () => {
        const mockProducts = [
            { id: 1, name: "Laptop", description: "", price: 1000 },
        ];
        jest.spyOn(apiModule, "getProducts").mockResolvedValue(mockProducts);
        const mockOnLogout = jest.fn();
        render(<Products onLogout={mockOnLogout} />);
        const detailText = await screen.findByText('No description available');
        expect(detailText).toBeInTheDocument();
    });
});
