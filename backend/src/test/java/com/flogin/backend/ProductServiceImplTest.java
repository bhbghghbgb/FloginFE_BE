package com.flogin.backend;

import com.flogin.backend.dto.ProductRequest;
import com.flogin.backend.dto.ProductResponse;
import com.flogin.backend.entity.Product;
import com.flogin.backend.repository.ProductRepository;
import com.flogin.backend.service.product.ProductServiceImpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.*;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.*;

import java.util.*;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class ProductServiceImplTest {

    @Mock
    private ProductRepository productRepository;

    @InjectMocks
    private ProductServiceImpl productService;

    private Product product;
    private ProductRequest request;

    @BeforeEach
    void setUp() {
        product = Product.builder()
                .id(1L)
                .name("Test Product")
                .price(100L)
                .quantity(10)
                .description("Test Description")
                .category("Test Category")
                .active(true)
                .build();

        request = new ProductRequest();
        request.setName("Test Product");
        request.setPrice(100L);
        request.setQuantity(10);
        request.setDescription("Test Description");
        request.setCategory("Test Category");
    }

    @Test
    void testCreateProduct_ShouldReturnProductResponse_WhenProductCreated() {
        when(productRepository.existsByName(request.getName())).thenReturn(false);
        when(productRepository.save(any(Product.class))).thenReturn(product);

        ProductResponse response = productService.createProduct(request);

        assertNotNull(response);
        assertEquals("Test Product", response.getName());
        verify(productRepository, times(1)).save(any(Product.class));
    }

    @Test
    void testCreateProduct_ShouldThrowException_WhenProductNameAlreadyExists() {
        when(productRepository.existsByName(request.getName())).thenReturn(true);

        assertThrows(IllegalArgumentException.class, () -> productService.createProduct(request));
        verify(productRepository, never()).save(any(Product.class));
    }

    @Test
    void testGetProductById_ShouldReturnProductResponse_WhenFound() {
        when(productRepository.findById(1L)).thenReturn(Optional.of(product));

        ProductResponse response = productService.getProductById(1L);

        assertNotNull(response);
        assertEquals(1L, response.getId());
    }

    @Test
    void testGetProductById_ShouldThrowException_WhenNotFound() {
        when(productRepository.findById(1L)).thenReturn(Optional.empty());

        assertThrows(IllegalArgumentException.class, () -> productService.getProductById(1L));
    }

    @Test
    void testUpdateProduct_ShouldReturnProductResponse_WhenProductUpdated() {
        when(productRepository.findById(1L)).thenReturn(Optional.of(product));
        when(productRepository.existsByName("Updated Product")).thenReturn(false);
        when(productRepository.save(any(Product.class))).thenReturn(product);

        request.setName("Updated Product");
        ProductResponse response = productService.updateProduct(1L, request);

        assertNotNull(response);
        assertEquals("Updated Product", response.getName());
        verify(productRepository, times(1)).save(any(Product.class));
    }
    @Test
    void testUpdateProduct_ShouldThrowException_WhenProductNotFound() {
        when(productRepository.findById(1L)).thenReturn(Optional.empty());

        assertThrows(IllegalArgumentException.class, ()->productService.updateProduct(1L, request));
    }
    @Test
    void testUpdateProduct_ShouldThrowException_WhenProductNameAlreadyExists() {
        request.setName("New Name");
        when(productRepository.findById(1L)).thenReturn(Optional.of(product));
        when(productRepository.existsByName(request.getName())).thenReturn(true);
        assertThrows(IllegalArgumentException.class, ()->productService.updateProduct(1L, request));
    }

    @Test
    void testDeleteProduct_ShouldChangeIsActiveToFalse_WhenSuccess() {
        when(productRepository.findById(1L)).thenReturn(Optional.of(product));

        productService.deleteProduct(1L);

        assertFalse(product.getActive());
        verify(productRepository, times(1)).save(product);
    }
    @Test
    void testDeleteProduct_ShouldThrowException_WhenProductNotFound() {
        when(productRepository.findById(1L)).thenReturn(Optional.empty());

        assertThrows(IllegalArgumentException.class, ()->productService.deleteProduct(1L));
    }

    @Test
    void testGetProducts_ShouldReturnPageProductResponse() {
        List<Product> productList = Arrays.asList(product);
        Page<Product> page = new PageImpl<>(productList);
        when(productRepository.findByNameContainingIgnoreCaseAndCategoryContainingIgnoreCaseAndActiveTrue(
                anyString(), anyString(), any(Pageable.class)
        )).thenReturn(page);

        Page<ProductResponse> responsePage = productService.getProducts("Test", "Test Category", 0, 10);

        assertNotNull(responsePage);
        assertEquals(1, responsePage.getTotalElements());
        assertEquals("Test Product", responsePage.getContent().get(0).getName());
    }
    @Test
    void testGetProducts_ShouldReturnPageProductResponse_WhenNameKeyWordNull() {
        List<Product> productList = Arrays.asList(product);
        Page<Product> page = new PageImpl<>(productList);
        when(productRepository.findByNameContainingIgnoreCaseAndCategoryContainingIgnoreCaseAndActiveTrue(
                anyString(), anyString(), any(Pageable.class)
        )).thenReturn(page);

        Page<ProductResponse> responsePage = productService.getProducts(null, "Test Category", 0, 10);

        assertNotNull(responsePage);
        assertEquals(1, responsePage.getTotalElements());
        assertEquals("Test Product", responsePage.getContent().get(0).getName());
    }
    @Test
    void testGetProducts_ShouldReturnPageProductResponse_WhenCategoryKeywordNull() {
        List<Product> productList = Arrays.asList(product);
        Page<Product> page = new PageImpl<>(productList);
        when(productRepository.findByNameContainingIgnoreCaseAndCategoryContainingIgnoreCaseAndActiveTrue(
                anyString(), anyString(), any(Pageable.class)
        )).thenReturn(page);

        Page<ProductResponse> responsePage = productService.getProducts("Test", null, 0, 10);

        assertNotNull(responsePage);
        assertEquals(1, responsePage.getTotalElements());
        assertEquals("Test Product", responsePage.getContent().get(0).getName());
    }
    @Test
    void testGetProducts_ShouldThrowException_WhenSizeIsZero() {
        assertThrows(IllegalArgumentException.class, ()->productService.getProducts("", "", 1, 0));
    }
    @Test
    void testGetProducts_ShouldThrowException_WhenPageNegative() {
        assertThrows(IllegalArgumentException.class, ()->productService.getProducts("", "", -1, 10));
    }
}
