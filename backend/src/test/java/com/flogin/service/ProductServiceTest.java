package com.flogin.service;

import com.flogin.dto.ProductDto;
import com.flogin.entity.Product;
import com.flogin.repository.ProductRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class ProductServiceTest {

    @Mock
    private ProductRepository productRepository;

    @InjectMocks
    private ProductService productService;

    @Test
    void getAllProducts_ReturnsProductsList() {
        // Given
        Product product = new Product();
        product.setId(1L);
        product.setName("Test Product");
        product.setPrice(99.99);

        when(productRepository.findAll()).thenReturn(List.of(product));

        // When
        List<ProductDto> result = productService.getAllProducts();

        // Then
        assertNotNull(result);
        assertEquals(1, result.size());
        assertEquals("Test Product", result.get(0).getName());
        assertEquals(99.99, result.get(0).getPrice());
    }

    @Test
    void getProduct_WithValidId_ReturnsProduct() {
        // Given
        Long productId = 1L;
        Product product = new Product();
        product.setId(productId);
        product.setName("Test Product");
        product.setPrice(99.99);

        when(productRepository.findById(productId)).thenReturn(Optional.of(product));

        // When
        ProductDto result = productService.getProduct(productId);

        // Then
        assertNotNull(result);
        assertEquals("Test Product", result.getName());
        assertEquals(99.99, result.getPrice());
    }

    @Test
    void createProduct_SavesAndReturnsProduct() {
        // Given
        ProductDto dto = new ProductDto();
        dto.setName("New Product");
        dto.setPrice(149.99);

        Product savedProduct = new Product();
        savedProduct.setId(1L);
        savedProduct.setName(dto.getName());
        savedProduct.setPrice(dto.getPrice());

        when(productRepository.save(any(Product.class))).thenReturn(savedProduct);

        // When
        ProductDto result = productService.createProduct(dto);

        // Then
        assertNotNull(result);
        assertEquals(1L, result.getId());
        assertEquals("New Product", result.getName());
        assertEquals(149.99, result.getPrice());
        verify(productRepository).save(any(Product.class));
    }

    @Test
    void updateProduct_WithValidId_UpdatesAndReturnsProduct() {
        // Given
        Long productId = 1L;
        ProductDto dto = new ProductDto();
        dto.setName("Updated Product");
        dto.setPrice(199.99);

        Product existingProduct = new Product();
        existingProduct.setId(productId);
        existingProduct.setName("Original Product");
        existingProduct.setPrice(99.99);

        when(productRepository.findById(productId)).thenReturn(Optional.of(existingProduct));
        when(productRepository.save(any(Product.class))).thenAnswer(i -> i.getArgument(0));

        // When
        ProductDto result = productService.updateProduct(productId, dto);

        // Then
        assertNotNull(result);
        assertEquals("Updated Product", result.getName());
        assertEquals(199.99, result.getPrice());
        verify(productRepository).save(any(Product.class));
    }

    @Test
    void deleteProduct_CallsRepositoryDelete() {
        // Given
        Long productId = 1L;

        // When
        productService.deleteProduct(productId);

        // Then
        verify(productRepository).deleteById(productId);
    }
}