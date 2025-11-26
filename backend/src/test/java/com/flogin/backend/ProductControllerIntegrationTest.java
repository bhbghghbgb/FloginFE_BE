package com.flogin.backend;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.flogin.backend.dto.ProductRequest;
import com.flogin.backend.dto.ProductResponse;
import com.flogin.backend.entity.Product;
import com.flogin.backend.repository.ProductRepository;
import com.flogin.backend.service.auth.IAuthService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.ResultActions;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
class ProductControllerIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private IAuthService authService;

    private Product testProduct;

    @BeforeEach
    void setUp() {
        // Clean up and create test products
        productRepository.deleteAll();

        testProduct = Product.builder()
            .name("Test Product")
            .price(9999L)
            .quantity(100)
            .description("Test Description")
            .category("Electronics")
            .build();

        testProduct = productRepository.save(testProduct);

        // Create additional test data
        Product product2 = Product.builder()
            .name("Another Product")
            .price(1999L)
            .quantity(50)
            .description("Another Description")
            .category("Books")
            .build();
        productRepository.saveAll(List.of(product2));
    }

    @Test
    @WithMockUser(roles = "ADMIN")
    void createProduct_Success() throws Exception {
        // Given
        ProductRequest request = ProductRequest.builder()
            .name("New Product")
            .price(14999L)
            .quantity(25)
            .description("New Product Description")
            .category("Home Appliances")
            .build();

        // When & Then
        ResultActions result = mockMvc.perform(post("/api/products")
                .with(csrf())
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.id").exists())
            .andExpect(jsonPath("$.name").value("New Product"))
            .andExpect(jsonPath("$.price").value(14999L))
            .andExpect(jsonPath("$.quantity").value(25))
            .andExpect(jsonPath("$.description").value("New Product Description"))
            .andExpect(jsonPath("$.category").value("Home Appliances"));

        // Verify product was saved in database
        String responseContent = result.andReturn().getResponse().getContentAsString();
        ProductResponse response = objectMapper.readValue(responseContent, ProductResponse.class);

        Product savedProduct = productRepository.findById(response.getId()).orElse(null);
        assertNotNull(savedProduct);
        assertEquals("New Product", savedProduct.getName());
        assertEquals(14999L, savedProduct.getPrice());
    }

    @Test
    @WithMockUser(roles = "USER")
        // Regular user without ADMIN role
    void createProduct_Forbidden_NonAdminUser() throws Exception {
        // Given
        ProductRequest request = ProductRequest.builder()
            .name("New Product")
            .price(14999L)
            .quantity(25)
            .category("Electronics")
            .build();

        // When & Then - Should be forbidden for non-admin users
        mockMvc.perform(post("/api/products")
                .with(csrf())
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
            .andExpect(status().isForbidden());
    }

    @Test
    void createProduct_Unauthenticated() throws Exception {
        // Given
        ProductRequest request = ProductRequest.builder()
            .name("New Product")
            .price(14999L)
            .quantity(25)
            .category("Electronics")
            .build();

        // When & Then - Should be unauthorized for unauthenticated users
        mockMvc.perform(post("/api/products")
                .with(csrf())
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
            .andExpect(status().isUnauthorized());
    }

    @Test
    @WithMockUser(roles = "ADMIN")
    void createProduct_ValidationError_NameTooShort() throws Exception {
        // Given
        ProductRequest request = ProductRequest.builder()
            .name("AB") // Too short - min 3 chars
            .price(14999L)
            .quantity(25)
            .category("Electronics")
            .build();

        // When & Then
        mockMvc.perform(post("/api/products")
                .with(csrf())
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
            .andExpect(status().isBadRequest());
    }

    @Test
    @WithMockUser(roles = "ADMIN")
    void createProduct_ValidationError_PriceZero() throws Exception {
        // Given
        ProductRequest request = ProductRequest.builder()
            .name("Valid Product")
            .price(0L) // Invalid - min 1
            .quantity(25)
            .category("Electronics")
            .build();

        // When & Then
        mockMvc.perform(post("/api/products")
                .with(csrf())
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
            .andExpect(status().isBadRequest());
    }

    @Test
    @WithMockUser(roles = "ADMIN")
    void updateProduct_Success() throws Exception {
        // Given
        ProductRequest request = ProductRequest.builder()
            .name("Updated Product")
            .price(19999L)
            .quantity(75)
            .description("Updated Description")
            .category("Updated Category")
            .build();

        // When & Then
        mockMvc.perform(put("/api/products/{id}", testProduct.getId())
                .with(csrf())
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.id").value(testProduct.getId()))
            .andExpect(jsonPath("$.name").value("Updated Product"))
            .andExpect(jsonPath("$.price").value(19999L))
            .andExpect(jsonPath("$.quantity").value(75))
            .andExpect(jsonPath("$.description").value("Updated Description"))
            .andExpect(jsonPath("$.category").value("Updated Category"));
    }

    @Test
    @WithMockUser(roles = "ADMIN")
    void updateProduct_NotFound() throws Exception {
        // Given
        ProductRequest request = ProductRequest.builder()
            .name("Updated Product")
            .price(19999L)
            .quantity(75)
            .category("Electronics")
            .build();

        // When & Then
        mockMvc.perform(put("/api/products/99999")
                .with(csrf())
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
            .andExpect(status().isNotFound());
    }

    @Test
    @WithMockUser
    void getProductById_Success() throws Exception {
        // When & Then
        mockMvc.perform(get("/api/products/{id}", testProduct.getId()))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.id").value(testProduct.getId()))
            .andExpect(jsonPath("$.name").value("Test Product"))
            .andExpect(jsonPath("$.price").value(9999L))
            .andExpect(jsonPath("$.quantity").value(100))
            .andExpect(jsonPath("$.description").value("Test Description"))
            .andExpect(jsonPath("$.category").value("Electronics"));
    }

    @Test
    @WithMockUser
    void getProductById_NotFound() throws Exception {
        // When & Then
        mockMvc.perform(get("/api/products/99999"))
            .andExpect(status().isNotFound());
    }

    @Test
    @WithMockUser
    void listProducts_AllProducts() throws Exception {
        // When & Then
        mockMvc.perform(get("/api/products"))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.content").isArray())
            .andExpect(jsonPath("$.content.length()").value(2))
            .andExpect(jsonPath("$.totalElements").value(2));
    }

    @Test
    @WithMockUser
    void listProducts_WithNameFilter() throws Exception {
        // When & Then
        mockMvc.perform(get("/api/products")
                .param("name", "Test"))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.content.length()").value(1))
            .andExpect(jsonPath("$.content[0].name").value("Test Product"));
    }

    @Test
    @WithMockUser
    void listProducts_WithCategoryFilter() throws Exception {
        // When & Then
        mockMvc.perform(get("/api/products")
                .param("category", "Books"))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.content.length()").value(1))
            .andExpect(jsonPath("$.content[0].category").value("Books"));
    }

    @Test
    @WithMockUser
    void listProducts_WithPagination() throws Exception {
        // When & Then
        mockMvc.perform(get("/api/products")
                .param("page", "0")
                .param("size", "1"))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.content.length()").value(1))
            .andExpect(jsonPath("$.totalPages").value(2))
            .andExpect(jsonPath("$.totalElements").value(2));
    }

    @Test
    @WithMockUser(roles = "ADMIN")
    void deleteProduct_Success() throws Exception {
        // When & Then
        mockMvc.perform(delete("/api/products/{id}", testProduct.getId())
                .with(csrf()))
            .andExpect(status().isNoContent());

        // Verify product is deleted
        Product deletedProduct = productRepository.findById(testProduct.getId()).orElse(null);
        assertNull(deletedProduct);
    }

    @Test
    @WithMockUser(roles = "ADMIN")
    void deleteProduct_NotFound() throws Exception {
        // When & Then
        mockMvc.perform(delete("/api/products/99999")
                .with(csrf()))
            .andExpect(status().isNotFound());
    }

    @Test
    @WithMockUser(roles = "USER")
    void deleteProduct_Forbidden_NonAdmin() throws Exception {
        // When & Then
        mockMvc.perform(delete("/api/products/{id}", testProduct.getId())
                .with(csrf()))
            .andExpect(status().isForbidden());
    }

    @Test
    @WithMockUser
    void listProducts_EmptyDatabase() throws Exception {
        // Given
        productRepository.deleteAll();

        // When & Then
        mockMvc.perform(get("/api/products"))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.content").isArray())
            .andExpect(jsonPath("$.content.length()").value(0))
            .andExpect(jsonPath("$.totalElements").value(0));
    }
}