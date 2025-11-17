package com.flogin.backend.service;

import com.flogin.backend.dto.ProductRequest;
import com.flogin.backend.dto.ProductResponse;
import org.springframework.data.domain.Page;

public interface IProductService {
    ProductResponse createProduct(ProductRequest request);
    ProductResponse updateProduct(Long id, ProductRequest request);
    ProductResponse getProductById(Long id);
    Page<ProductResponse> getProducts(String nameKeyword, String categoryKeyword, int page, int size);
    void deleteProduct(Long id);
}
