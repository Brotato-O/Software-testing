package com.flogin.controller;

import com.flogin.dto.ProductDto;
import com.flogin.service.ProductService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.util.List;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.doNothing;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(ProductController.class)
class ProductControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private ProductService productService;

    @Test
    void getAllProducts_ReturnsProducts() throws Exception {
        // Given
        ProductDto product = new ProductDto();
        product.setId(1L);
        product.setName("Test Product");
        product.setPrice(99.99);

        when(productService.getAllProducts()).thenReturn(List.of(product));

        // When/Then
        mockMvc.perform(get("/api/products"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].id").value(1))
                .andExpect(jsonPath("$[0].name").value("Test Product"))
                .andExpect(jsonPath("$[0].price").value(99.99));
    }

    @Test
    void getProduct_WithValidId_ReturnsProduct() throws Exception {
        // Given
        ProductDto product = new ProductDto();
        product.setId(1L);
        product.setName("Test Product");
        product.setPrice(99.99);

        when(productService.getProduct(1L)).thenReturn(product);

        // When/Then
        mockMvc.perform(get("/api/products/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(1))
                .andExpect(jsonPath("$.name").value("Test Product"))
                .andExpect(jsonPath("$.price").value(99.99));
    }

    @Test
    void createProduct_WithValidData_ReturnsCreatedProduct() throws Exception {
        // Given
        ProductDto product = new ProductDto();
        product.setId(1L);
        product.setName("New Product");
        product.setPrice(149.99);

        when(productService.createProduct(any(ProductDto.class))).thenReturn(product);

        // When/Then
        mockMvc.perform(post("/api/products")
                .contentType(MediaType.APPLICATION_JSON)
                .content("{\"name\":\"New Product\",\"price\":149.99}"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(1))
                .andExpect(jsonPath("$.name").value("New Product"))
                .andExpect(jsonPath("$.price").value(149.99));
    }

    @Test
    void updateProduct_WithValidData_ReturnsUpdatedProduct() throws Exception {
        // Given
        ProductDto product = new ProductDto();
        product.setId(1L);
        product.setName("Updated Product");
        product.setPrice(199.99);

        when(productService.updateProduct(eq(1L), any(ProductDto.class))).thenReturn(product);

        // When/Then
        mockMvc.perform(put("/api/products/1")
                .contentType(MediaType.APPLICATION_JSON)
                .content("{\"name\":\"Updated Product\",\"price\":199.99}"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(1))
                .andExpect(jsonPath("$.name").value("Updated Product"))
                .andExpect(jsonPath("$.price").value(199.99));
    }

    @Test
    void deleteProduct_ReturnsOk() throws Exception {
        // Given
        doNothing().when(productService).deleteProduct(1L);

        // When/Then
        mockMvc.perform(delete("/api/products/1"))
                .andExpect(status().isOk());
    }
}