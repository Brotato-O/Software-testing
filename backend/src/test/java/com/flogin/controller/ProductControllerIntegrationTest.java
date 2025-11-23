package com.flogin.controller;

import com.flogin.dto.ProductDto;
import com.flogin.service.ProductService;

import java.util.Arrays;
import com.fasterxml.jackson.databind.ObjectMapper;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import static org.hamcrest.Matchers.hasSize;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.Mockito.doNothing;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import java.util.List;

@WebMvcTest(ProductController.class)
@DisplayName("Product API Integration Tests")
class ProductControllerIntegrationTest {

        @Autowired
        private MockMvc mockMvc;

        @Autowired(required = false)
        private ObjectMapper objectMapper;

        @MockBean
        private ProductService productService;

        // ============================================
        // 1️⃣ Test POST /api/auth/login thành công
        // ============================================
        @Test
        @DisplayName("GET /api/products -  Lay danh sach san pham thanh cong")
        void testGetAllProducts() throws Exception {
                List<ProductDto> products = Arrays.asList(
                                new ProductDto(1L, "Laptop", "Laptop gaming cấu hình mạnh", 15000000.0),
                                new ProductDto(2L, "Mouse", "Chuột không dây", 200000.0));

                when(productService.getAllProducts()).thenReturn(products);
                mockMvc.perform(get("/api/products"))
                                .andExpect(status().isOk())
                                .andExpect(jsonPath("$", hasSize(2)))
                                .andExpect(jsonPath("$[0].name").value("Laptop"));

        }

        @Test
        @DisplayName("POST /api/products- Tao san pham moi")
        void testCreateProduct() throws Exception {
                ProductDto newProduct = new ProductDto(null, "Keyboard", "Bàn phím cơ", 800000.0);
                ProductDto createdProduct = new ProductDto(3L, "Keyboard", "Bàn phím cơ", 800000.0);

                when(productService.createProduct(any(ProductDto.class))).thenReturn(createdProduct);

                mockMvc.perform(post("/api/products")
                                .contentType(MediaType.APPLICATION_JSON)
                                .content(objectMapper.writeValueAsString(newProduct)))
                                .andExpect(status().isOk())
                                .andExpect(jsonPath("$.id").value(3L))
                                .andExpect(jsonPath("$.name").value("Keyboard"));
        }

        @Test
        @DisplayName("GET /api/products - Danh sach san pham rong")
        void testGetAllProducts_EmptyList() throws Exception {
                when(productService.getAllProducts()).thenReturn(List.of());

                mockMvc.perform(get("/api/products"))
                                .andExpect(status().isOk())
                                .andExpect(jsonPath("$", hasSize(0)));
        }

        @Test
        @DisplayName("POST /api/products - Tao san pham voi du lieu khong hop le")
        void testCreateProduct_InvalidData() throws Exception {
                ProductDto invalidProduct = new ProductDto(null, "", "Mo ta", -5000.0);

                mockMvc.perform(post("/api/products")
                                .contentType(MediaType.APPLICATION_JSON)
                                .content(objectMapper.writeValueAsString(invalidProduct)))
                                .andExpect(status().isBadRequest());
        }

        @Test
        @DisplayName("GET /api/products/{id} - San pham khong ton tai")
        void testGetProduct_NotFound() throws Exception {
                Long nonExistentId = 999L;

                when(productService.getProduct(nonExistentId))
                                .thenThrow(new RuntimeException("Product not found"));

                mockMvc.perform(get("/api/products/{id}", nonExistentId))
                                .andExpect(status().isInternalServerError());
        }

        @Test
        @DisplayName("GET /api/products/{id} - Lay thong tin san pham thanh cong")
        void testGetProduct_Success() throws Exception {
                Long productId = 1L;
                ProductDto product = new ProductDto(productId, "Laptop", "Laptop gaming cấu hình mạnh", 15000000.0);

                when(productService.getProduct(productId)).thenReturn(product);

                mockMvc.perform(get("/api/products/{id}", productId))
                                .andExpect(status().isOk())
                                .andExpect(jsonPath("$.id").value(productId))
                                .andExpect(jsonPath("$.name").value("Laptop"));
        }

        @Test
        @DisplayName("PUT /api/products/{id} - Cap nhat san pham thanh cong")
        void testUpdateProduct_Success() throws Exception {
                Long productId = 1L;
                ProductDto updatedProduct = new ProductDto(productId, "LaptopUpdated", "Updated description",
                                16000000.0);

                when(productService.updateProduct(any(Long.class), any(ProductDto.class))).thenReturn(updatedProduct);

                mockMvc.perform(put("/api/products/{id}", productId)
                                .contentType(MediaType.APPLICATION_JSON)
                                .content(objectMapper.writeValueAsString(updatedProduct)))
                                .andExpect(status().isOk())
                                .andExpect(jsonPath("$.id").value(productId))
                                .andExpect(jsonPath("$.name").value("Laptop Updated"));
        }

        // @Test
        // @DisplayName("DELETE /api/products/{id} - Xoa san pham thanh cong")
        // void testDeleteProduct_Success() throws Exception {
        // Long productId = 1L;
        // // In ra productService để kiểm tra mock có inject được không
        // System.out.println(productService);
        // // Mock service không làm gì, chỉ để controller gọi được
        // doNothing().when(productService).deleteProduct(anyLong());

        // mockMvc.perform(delete("/api/products/{id}", productId))
        // .andExpect(status().isOk());
        // }
        @Test
        @DisplayName("DELETE /api/products/{id} - Xoa san pham thanh cong")
        void testDeleteProduct_Success() throws Exception {
                Long productId = 1L;

                // Mock service không làm gì, chỉ để controller gọi được
                doNothing().when(productService).deleteProduct(anyLong());

                mockMvc.perform(delete("/api/products/{id}", productId))
                                .andExpect(status().isOk());
        }

        @Test
        @DisplayName("PUT /api/products/{id} - Cap nhat san pham khong ton tai")
        void testUpdateProduct_NotFound() throws Exception {
                Long nonExistentId = 999L;
                ProductDto updatedProduct = new ProductDto(nonExistentId, "Non-existent Product", "No description",
                                0.0);

                when(productService.updateProduct(any(Long.class), any(ProductDto.class)))
                                .thenThrow(new RuntimeException("Product not found"));

                mockMvc.perform(put("/api/products/{id}", nonExistentId)
                                .contentType(MediaType.APPLICATION_JSON)
                                .content(objectMapper.writeValueAsString(updatedProduct)))
                                .andExpect(status().isInternalServerError());
        }
}
