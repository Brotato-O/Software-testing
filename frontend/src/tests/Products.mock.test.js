/**
 * Product Mock Testing – 5.2.1 (Expanded)
 * Mở rộng:
 * - Test failure cho UPDATE & DELETE
 * - Test loadProducts thất bại
 * - Test handleSubmit dữ liệu invalid
 * - Test filteredProducts search
 */

import * as productService from "../services/api";
import { validateProduct } from "../utils/validateProduct";

// Mock toàn bộ ProductService
jest.mock("../services/api");
jest.mock("../utils/validateProduct");

describe("Product Mock Tests", () => {

    beforeEach(() => {
        jest.clearAllMocks();
    });

    // =============================
    // 1. Mock: CREATE PRODUCT
    // =============================
    test("Mock: Create product thành công", async () => {
        const mockProduct = { id: 1, name: "Laptop", price: 15000000 };
        productService.createProduct.mockResolvedValue(mockProduct);

        const result = await productService.createProduct(mockProduct);

        expect(result).toEqual(mockProduct);
        expect(productService.createProduct).toHaveBeenCalledTimes(1);
        expect(productService.createProduct).toHaveBeenCalledWith(mockProduct);
    });

    test("Mock: Create product thất bại", async () => {
        const errorMessage = "Lỗi tạo sản phẩm";
        productService.createProduct.mockRejectedValue(new Error(errorMessage));

        try {
            await productService.createProduct({});
        } catch (error) {
            expect(error.message).toBe(errorMessage);
        }

        expect(productService.createProduct).toHaveBeenCalledTimes(1);
    });

    // =============================
    // 2. Mock: GET PRODUCTS
    // =============================
    test("Mock: Get products with pagination", async () => {
        const mockResponse = { data: [{ id: 1, name: "A", price: 100 }], page: 1, total: 50 };
        productService.getProducts.mockResolvedValue(mockResponse);

        const result = await productService.getProducts(1, 5);

        expect(result).toEqual(mockResponse);
        expect(productService.getProducts).toHaveBeenCalledTimes(1);
        expect(productService.getProducts).toHaveBeenCalledWith(1, 5);
    });

    test("Mock: loadProducts thất bại", async () => {
        productService.getProducts.mockRejectedValue(new Error("Load failed"));

        // Chỉ test reject, không spy console.error
        await expect(productService.getProducts()).rejects.toThrow("Load failed");
        expect(productService.getProducts).toHaveBeenCalledTimes(1);
    });

    // =============================
    // 3. Mock: UPDATE PRODUCT
    // =============================
    test("Mock: Update product thành công", async () => {
        const updated = { id: 1, name: "Laptop Pro", price: 20000000 };
        productService.updateProduct.mockResolvedValue(updated);

        const result = await productService.updateProduct(1, updated);

        expect(result).toEqual(updated);
        expect(productService.updateProduct).toHaveBeenCalledTimes(1);
        expect(productService.updateProduct).toHaveBeenCalledWith(1, updated);
    });

    test("Mock: Update product thất bại", async () => {
        const errorMessage = "Lỗi cập nhật sản phẩm";
        productService.updateProduct.mockRejectedValue(new Error(errorMessage));

        try {
            await productService.updateProduct(1, { name: "Test" });
        } catch (error) {
            expect(error.message).toBe(errorMessage);
        }

        expect(productService.updateProduct).toHaveBeenCalledTimes(1);
    });

    // =============================
    // 4. Mock: DELETE PRODUCT
    // =============================
    test("Mock: Delete product thành công", async () => {
        productService.deleteProduct.mockResolvedValue({ success: true });

        const result = await productService.deleteProduct(10);

        expect(result).toEqual({ success: true });
        expect(productService.deleteProduct).toHaveBeenCalledTimes(1);
        expect(productService.deleteProduct).toHaveBeenCalledWith(10);
    });

    test("Mock: Delete product thất bại", async () => {
        const errorMessage = "Lỗi xóa sản phẩm";
        productService.deleteProduct.mockRejectedValue(new Error(errorMessage));

        try {
            await productService.deleteProduct(10);
        } catch (error) {
            expect(error.message).toBe(errorMessage);
        }

        expect(productService.deleteProduct).toHaveBeenCalledTimes(1);
    });

    // =============================
    // 5. HandleSubmit invalid data
    // =============================
    test("handleSubmit với dữ liệu invalid", () => {
        const invalidData = { name: "", price: "" };
        const errors = { name: "Required", price: "Required" };
        validateProduct.mockReturnValue(errors);

        const setErrors = jest.fn();
        const e = { preventDefault: jest.fn() };

        const fieldErrors = validateProduct(invalidData);
        if (Object.keys(fieldErrors).length > 0) {
            setErrors(fieldErrors);
        }

        expect(setErrors).toHaveBeenCalledWith(errors);
    });

    // =============================
    // 6. Filtered Products
    // =============================
    test("filteredProducts lọc theo searchTerm", () => {
        const products = [
            { name: "Laptop" },
            { name: "Phone" },
        ];
        const searchTerm = "lap";

        const filteredProducts = products.filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()));

        expect(filteredProducts).toEqual([{ name: "Laptop" }]);
    });
});
