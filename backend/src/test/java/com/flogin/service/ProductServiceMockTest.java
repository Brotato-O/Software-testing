package com.flogin.service;

import com.flogin.dto.ProductDto;
import com.flogin.entity.Product;
import com.flogin.repository.ProductRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class ProductServiceMockTest {

    @Mock
    private ProductRepository productRepository;

    @InjectMocks
    private ProductService productService;

    @BeforeEach
    void init() {
        MockitoAnnotations.openMocks(this);
    }

    // ======================================================
    @Test
    @DisplayName("createProduct() - success")
    void testCreateProduct() {
        ProductDto dto = new ProductDto();
        dto.setName("Laptop");
        dto.setDescription("Gaming");
        dto.setPrice(1500.0);

        // mock entity returned from repository
        Product saved = new Product();
        saved.setId(1L);
        saved.setName("Laptop");
        saved.setDescription("Gaming");
        saved.setPrice(1500.0);

        when(productRepository.save(any(Product.class)))
                .thenReturn(saved);

        ProductDto result = productService.createProduct(dto);

        assertEquals(1L, result.getId());
        assertEquals("Laptop", result.getName());

        verify(productRepository).save(any(Product.class));
    }

    // ======================================================
    @Test
    @DisplayName("getProduct() - found")
    void testGetProduct() {
        Product entity = new Product();
        entity.setId(1L);
        entity.setName("Phone");
        entity.setDescription("Flagship");
        entity.setPrice(2000.0);

        when(productRepository.findById(1L)).thenReturn(Optional.of(entity));

        ProductDto result = productService.getProduct(1L);

        assertEquals("Phone", result.getName());

        verify(productRepository).findById(1L);
    }

    @Test
    @DisplayName("getProduct() - NOT FOUND → Exception")
    void testGetProduct_NotFound() {
        when(productRepository.findById(99L)).thenReturn(Optional.empty());

        RuntimeException ex = assertThrows(RuntimeException.class,
                () -> productService.getProduct(99L));

        assertEquals("Product not found", ex.getMessage());
    }

    // ======================================================
    @Test
    @DisplayName("updateProduct() - success")
    void testUpdateProduct() {
        Product existing = new Product();
        existing.setId(1L);
        existing.setName("Old");
        existing.setDescription("Old desc");
        existing.setPrice(500.0);

        ProductDto dto = new ProductDto();
        dto.setName("New");
        dto.setDescription("Updated desc");
        dto.setPrice(999.0);

        Product saved = new Product();
        saved.setId(1L);
        saved.setName("New");
        saved.setDescription("Updated desc");
        saved.setPrice(999.0);

        when(productRepository.findById(1L)).thenReturn(Optional.of(existing));
        when(productRepository.save(any(Product.class))).thenReturn(saved);

        ProductDto result = productService.updateProduct(1L, dto);

        assertEquals("New", result.getName());

        verify(productRepository).findById(1L);
        verify(productRepository).save(any(Product.class));
    }

    @Test
    @DisplayName("updateProduct() - NOT FOUND → Exception")
    void testUpdateProduct_NotFound() {
        ProductDto dto = new ProductDto();
        dto.setName("New");
        dto.setDescription("Updated");
        dto.setPrice(999.0);

        when(productRepository.findById(99L)).thenReturn(Optional.empty());

        RuntimeException ex =
                assertThrows(RuntimeException.class, () -> productService.updateProduct(99L, dto));

        assertEquals("Product not found", ex.getMessage());
    }

    // ======================================================
    @Test
    @DisplayName("deleteProduct() - success")
    void testDeleteProduct() {
        doNothing().when(productRepository).deleteById(1L);

        productService.deleteProduct(1L);

        verify(productRepository).deleteById(1L);
    }

    // ======================================================
    @Test
    @DisplayName("getAllProducts() - return list")
    void testGetAllProducts() {
        Product p1 = new Product();
        p1.setId(1L);
        p1.setName("A");
        p1.setDescription("Desc A");
        p1.setPrice(10.0);

        Product p2 = new Product();
        p2.setId(2L);
        p2.setName("B");
        p2.setDescription("Desc B");
        p2.setPrice(20.0);

        List<Product> mockList = Arrays.asList(p1, p2);

        when(productRepository.findAll()).thenReturn(mockList);

        List<ProductDto> result = productService.getAllProducts();

        assertEquals(2, result.size());
        assertEquals("A", result.get(0).getName());
        assertEquals("B", result.get(1).getName());

        verify(productRepository).findAll();
    }
}
