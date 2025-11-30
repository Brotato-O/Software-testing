package com.flogin.controller;

import com.flogin.dto.ProductDto;
import com.flogin.service.ProductService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.*;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import java.util.*;

import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@ExtendWith(MockitoExtension.class)
class ProductControllerMockTest {

    @Mock
    private ProductService productService;

    @InjectMocks
    private ProductController productController;

    private MockMvc mockMvc;

    @BeforeEach
    void setup() {
        // productController đã được inject mock xong
        mockMvc = MockMvcBuilders.standaloneSetup(productController).build();
    }

    @Test
    void testGetProductById() throws Exception {
        ProductDto dto = new ProductDto();
        dto.setId(1L);
        dto.setName("Laptop");
        dto.setPrice(1000.0);

        when(productService.getProduct(1L)).thenReturn(dto);

        mockMvc.perform(get("/api/products/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.name").value("Laptop"));

        verify(productService).getProduct(1L);
    }

    @Test
    void testGetAllProducts() throws Exception {
        ProductDto dto = new ProductDto();
        dto.setId(1L);
        dto.setName("Product A");
        dto.setPrice(50.0);

        when(productService.getAllProducts()).thenReturn(List.of(dto));

        mockMvc.perform(get("/api/products"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(1));

        verify(productService).getAllProducts();
    }

    @Test
    void testCreateProduct() throws Exception {
        ProductDto saved = new ProductDto();
        saved.setId(10L);
        saved.setName("Phone");
        saved.setPrice(500.0);

        when(productService.createProduct(any())).thenReturn(saved);

        mockMvc.perform(post("/api/products")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"name\":\"Phone\",\"price\":500}"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(10));

        verify(productService).createProduct(any());
    }

    @Test
    void testUpdateProduct() throws Exception {
        ProductDto updated = new ProductDto();
        updated.setId(2L);
        updated.setName("Updated");
        updated.setPrice(999.0);

        when(productService.updateProduct(eq(2L), any())).thenReturn(updated);

        mockMvc.perform(put("/api/products/2")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"name\":\"Updated\",\"price\":999}"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.name").value("Updated"));

        verify(productService).updateProduct(eq(2L), any());
    }

    @Test
    void testDeleteProduct() throws Exception {
        doNothing().when(productService).deleteProduct(5L);

        mockMvc.perform(delete("/api/products/5"))
                .andExpect(status().isOk());

        verify(productService).deleteProduct(5L);
    }
}
