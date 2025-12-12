import '@testing-library/jest-dom';
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import Products from "../components/Products";
import { act } from "react";
import * as apiModule from "../services/ProductService"; // mock API
jest.mock('../services/ProductService');

describe("ProductList Component Integration", () => {
    // Test tải và hiển thị danh sách sản phẩm từ API
    test("loads and displays product list from API", async () => {
        const mockProducts = [
            { id: 1, name: "Laptop", description: "Gaming laptop", price: 1000 },
            { id: 2, name: "Mouse", description: "Wireless mouse", price: 25 },
        ];

        jest.spyOn(apiModule, "getProducts").mockResolvedValue(mockProducts);

        const mockOnLogout = jest.fn();
        render(<Products onLogout={mockOnLogout} />);

        // Đợi dữ liệu được load và hiển thị
        await waitFor (async () =>{
            expect(apiModule.getProducts).toHaveBeenCalledTimes(1);
            expect(await screen.findByText("Laptop")).toBeInTheDocument();
            expect( screen.getByText("Mouse")).toBeInTheDocument();

            const productCards = screen.getAllByText(/\$/); 
            expect(productCards.length).toBe(4); 
    })
    });

    test ("handle empty product list", async ()=>{
        jest.spyOn(apiModule, "getProducts").mockResolvedValue([]);
        const mockOnLogout = jest.fn();
        render(<Products onLogout={mockOnLogout} />);
        const noProductsText = await screen.findByText('No products yet');
        await waitFor (async () =>{
            expect(noProductsText).toBeInTheDocument();
        })
    });

    test("handle API error on loading products", async () => {
    const consoleSpy = jest.spyOn(console, "error").mockImplementation(() => {});

    jest.spyOn(apiModule, "getProducts").mockRejectedValue(new Error("Failed to fetch products"));

    const mockOnLogout = jest.fn();
    render(<Products onLogout={mockOnLogout} />);

    await waitFor(() => {
        expect(consoleSpy).toHaveBeenCalledWith(
            "Failed to load products:",
            expect.any(Error)
        );
    });

    consoleSpy.mockRestore();
});


    // Test tạo sản phẩm mới với unvalid data
    test("create new products with empty name", async () => {
        const mockOnLogout = jest.fn();
        render(<Products onLogout={mockOnLogout} />);
        const addBtn = screen.getByRole('button', { name: "Add Product" });
        fireEvent.click(addBtn);

        const error = await screen.findByText('Ten san pham khong duoc de trong');
        await waitFor (async () =>{
        expect(error).toBeInTheDocument();
        })
    })

    test("create new products with short name", async () => {
        const mockOnLogout = jest.fn();
        render(<Products onLogout={mockOnLogout} />);

        const addBtn = screen.getByRole('button', { name: "Add Product" });
        const nameInput = screen.getByLabelText('Product Name *');

        fireEvent.change(nameInput, { target: { value: 'ab' } }); //tên quá ngắn
        fireEvent.click(addBtn);

        const nameError = await screen.findByText('Ten san pham phai co it nhat 3 ky tu');
        await waitFor (async () =>{
        expect(nameError).toBeInTheDocument();
        })
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
        await waitFor (async () =>{
        expect(priceError).toBeInTheDocument();
        })
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
        await waitFor (async () =>{
        expect(priceError).toBeInTheDocument();
        })
    });

    //test tạo sản phẩm mới với valid data
    test("Create new products with valid data", async () => {
        const product=
            {id: 1, name:"aaaaa", description: "", price: 1} ;
        apiModule.getProducts.mockResolvedValueOnce([{ id: 2, name: "bbbb", description: "", price: 2 }]);
        apiModule.getProducts.mockResolvedValueOnce([{ id: 2, name: "bbbb", description: "", price: 2 }, product]);
        apiModule.createProduct.mockResolvedValue(product);
        const resultGet= jest.spyOn(apiModule, "getProducts");
         const result = jest.spyOn(apiModule, "createProduct");
        //  const resultGet= jest.spyOn(apiModule, "getProducts");
        
        render (<Products onLogout={jest.fn()} />);

        const name= screen.getByLabelText("Product Name *");
        const value= screen.getByLabelText('Price ($) *');
        fireEvent.change(name, {target: {value: "aaaaa"}});
        fireEvent.change(value, {target: {value: 1}});
        fireEvent.click(screen.getByRole("button", {name: "Add Product"}));
        
           await waitFor(async() => {
        expect(result).toHaveBeenCalledTimes(1);
        expect(resultGet).toHaveBeenCalledTimes(2);
        expect(await screen.findByText("aaaaa")).toBeInTheDocument();
    });
            
screen.debug();
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
        }); 
        fireEvent.change(priceInput, { target: { value: '' } });

        const saveBtn = screen.getByRole('button', { name: /Update Product/i });
        fireEvent.click(saveBtn);

        const nameError = await screen.findByText('Ten san pham khong duoc de trong');
        const priceError = await screen.findByText('Gia san pham khong duoc de trong');
        await waitFor(async() => {
        expect(nameError).toBeInTheDocument();
        expect(priceError).toBeInTheDocument();
        })
    });

    //test edit sản phẩm với valid data
    test("edit product with valid data", async () => {

       const product= {id: 1, name: "aaaa", description:"", price:1};
        apiModule.getProducts.mockResolvedValueOnce([product]);

        const editProduct= {id: 1, name:"bbbbb", description:"bb", price: 2};
        apiModule.getProducts.mockResolvedValueOnce([editProduct]);
        apiModule.updateProduct.mockResolvedValue(editProduct);

        const resultGet= jest.spyOn(apiModule, "getProducts");
        const resultUpdate= jest.spyOn(apiModule, "updateProduct");

        render(<Products onLogout={jest.fn()} />);

        fireEvent.click(await screen.findByTestId("edit-product-btn"));
        fireEvent.change(screen.getByLabelText("Product Name *"), {target: {value: "bbbbb"}});
        fireEvent.change(screen.getByLabelText("Price ($) *"), {target: {value: 2}});
        fireEvent.click(await screen.findByRole("button", {name: "Update Product"}));

        await waitFor(()=>{
            expect(resultGet).toHaveBeenCalledTimes(2);
            expect(resultUpdate).toHaveBeenCalledTimes(1);
        })
    });

    //test xóa sản phẩm
    test("delete product", async () => {
        const mockProducts = [
            { id: 1, name: "Laptop", description: "Gaming laptop", price: 1000 },
        ];

        // Mock API
        jest.spyOn(apiModule, "getProducts").mockResolvedValueOnce(mockProducts);
        jest.spyOn(apiModule, "deleteProduct").mockResolvedValue({});

        jest.spyOn(window, "confirm").mockImplementation(() => true);

        const mockOnLogout = jest.fn();
        render(<Products onLogout={mockOnLogout} />);

        const deleteBtn = await screen.findByTitle('Delete');
        fireEvent.click(deleteBtn);

        apiModule.getProducts.mockResolvedValueOnce([]);

        // Chờ UI cập nhật
        const noProducts = await screen.findByText('No products yet');
        await waitFor(async() => {
        expect(noProducts).toBeInTheDocument();
        })

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
        await waitFor(async() => {
        expect(detailText).toBeInTheDocument();
        })
    });

    test("view empty product details", async () => {
        const mockProducts = [
            { id: 1, name: "Laptop", description: "", price: 1000 },
        ];
        jest.spyOn(apiModule, "getProducts").mockResolvedValue(mockProducts);
        const mockOnLogout = jest.fn();
        render(<Products onLogout={mockOnLogout} />);
        const detailText = await screen.findByText('No description available');
        await waitFor(async() => {
        expect(detailText).toBeInTheDocument();
        })
    });
});
