package com.flogin.service;

import com.flogin.dto.ProductDto;
import com.flogin.entity.Product;
import com.flogin.repository.ProductRepository;
import org.junit.jupiter.api.*;
import org.mockito.*;
import org.springframework.data.domain.*;
import java.util.*;
import static org.mockito.Mockito.*;
import static org.junit.jupiter.api.Assertions.*;

@DisplayName("Product Service Unit Tests")
class ProductServiceTest {

    @Mock
    private ProductRepository productRepository;

    @InjectMocks
    private ProductService productService;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    @DisplayName("TC1: Tạo sản phẩm mới thành công")
    void testCreateProduct() {
        // Constructor: ProductDto(String name, Double price, Integer quantity, String
        // category)
        ProductDto productDto = new ProductDto("Laptop", 15000000.0, 10, "Electronics");

        // Constructor: Product(Long id, String name, Double price, Integer quantity,
        // String category)
        Product product = new Product(1L, "Laptop", 15000000.0, 10, "Electronics");

        when(productRepository.save(any(Product.class))).thenReturn(product);

        ProductDto result = productService.createProduct(productDto);

        assertNotNull(result);
        assertEquals("Laptop", result.getName());
        assertEquals(15000000.0, result.getPrice());
        verify(productRepository, times(1)).save(any(Product.class));
    }

    @Test
    @DisplayName("TC2: Cập nhật sản phẩm thành công")
    void testUpdateProduct() {
        ProductDto productDto = new ProductDto("Laptop", 16000000.0, 12, "Electronics");
        Product product = new Product(1L, "Laptop", 16000000.0, 12, "Electronics");

        when(productRepository.findById(1L)).thenReturn(Optional.of(product));
        when(productRepository.save(any(Product.class))).thenReturn(product);

        ProductDto result = productService.updateProduct(1L, productDto);

        assertNotNull(result);
        assertEquals(16000000.0, result.getPrice());
        verify(productRepository, times(1)).findById(1L);
        verify(productRepository, times(1)).save(any(Product.class));
    }

    @Test
    @DisplayName("TC3: Lấy sản phẩm theo ID thành công")
    void testGetProduct() {
        Product product = new Product(1L, "Laptop", 15000000.0, 10, "Electronics");
        when(productRepository.findById(1L)).thenReturn(Optional.of(product));

        ProductDto result = productService.getProduct(1L);

        assertNotNull(result);
        assertEquals("Laptop", result.getName());
        verify(productRepository, times(1)).findById(1L);
    }

    @Test
    @DisplayName("TC4: Xóa sản phẩm thành công")
    void testDeleteProduct() {
        doNothing().when(productRepository).deleteById(1L);

        // deleteProduct() trả về void nên không gán vào biến
        productService.deleteProduct(1L);

        verify(productRepository, times(1)).deleteById(1L);
    }

    @Test
    @DisplayName("TC5: Lấy danh sách sản phẩm với phân trang")
    void testGetAllProductsWithPagination() {
        // Tạo list Product
        List<Product> products = new ArrayList<>();
        products.add(new Product(1L, "Laptop", 15000000.0, 10, "Electronics"));
        products.add(new Product(2L, "Mouse", 500000.0, 20, "Electronics"));

        Page<Product> page = new PageImpl<>(products);
        when(productRepository.findAll(any(Pageable.class))).thenReturn(page);

        // Gọi method với Pageable
        Page<ProductDto> result = productService.getAllProducts(PageRequest.of(0, 10));

        assertNotNull(result);
        assertEquals(2, result.getContent().size());
        assertEquals("Laptop", result.getContent().get(0).getName());
        assertEquals("Mouse", result.getContent().get(1).getName());
        verify(productRepository, times(1)).findAll(any(Pageable.class));
    }

    @Test
    @DisplayName("TC6: Lấy tất cả sản phẩm không phân trang")
    void testGetAllProducts() {
        List<Product> products = new ArrayList<>();
        products.add(new Product(1L, "Laptop", 15000000.0, 10, "Electronics"));
        products.add(new Product(2L, "Mouse", 500000.0, 20, "Electronics"));

        when(productRepository.findAll()).thenReturn(products);

        List<ProductDto> result = productService.getAllProducts();

        assertNotNull(result);
        assertEquals(2, result.size());
        assertEquals("Laptop", result.get(0).getName());
        verify(productRepository, times(1)).findAll();
    }

    @Test
    @DisplayName("TC7: Lấy sản phẩm theo ID - Không tìm thấy")
    void testGetProductNotFound() {
        when(productRepository.findById(999L)).thenReturn(Optional.empty());

        Exception exception = assertThrows(RuntimeException.class, () -> {
            productService.getProduct(999L);
        });

        assertEquals("Product not found", exception.getMessage());
        verify(productRepository, times(1)).findById(999L);
    }

    @Test
    @DisplayName("TC8: Cập nhật sản phẩm - Không tìm thấy")
    void testUpdateProductNotFound() {
        ProductDto productDto = new ProductDto("Laptop", 10000.0, 5, "Electronics");

        when(productRepository.findById(999L)).thenReturn(Optional.empty());

        Exception exception = assertThrows(RuntimeException.class, () -> {
            productService.updateProduct(999L, productDto);
        });

        assertEquals("Product not found", exception.getMessage());
        verify(productRepository, times(1)).findById(999L);
        verify(productRepository, never()).save(any(Product.class));
    }
}