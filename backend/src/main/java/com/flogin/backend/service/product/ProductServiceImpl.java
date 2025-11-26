package com.flogin.backend.service.product;

import com.flogin.backend.dto.ProductRequest;
import com.flogin.backend.dto.ProductResponse;
import com.flogin.backend.entity.Product;
import com.flogin.backend.exception.EntityNotFoundException;
import com.flogin.backend.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class ProductServiceImpl implements IProductService {

    private final ProductRepository productRepository;

    // --- Create product ---
    @Transactional
    public ProductResponse createProduct(ProductRequest request) {
        if (productRepository.existsByName(request.getName())) {
            throw new IllegalArgumentException("Product with this name already exists");
        }

        Product product = Product.builder()
            .name(request.getName())
            .price(request.getPrice())
            .quantity(request.getQuantity())
            .description(request.getDescription())
            .category(request.getCategory())
            .build();

        productRepository.save(product);

        return mapToResponse(product);
    }

    // --- Update product ---
    @Transactional
    public ProductResponse updateProduct(Long id, ProductRequest request) {
        Product product = productRepository.findById(id)
            .orElseThrow(() -> EntityNotFoundException.forId(Product.class, id));
        // Nếu đổi tên, kiểm tra trùng
        if (!product.getName().equalsIgnoreCase(request.getName())
            && productRepository.existsByName(request.getName())) {
            throw new IllegalArgumentException("Product with this name already exists");
        }

        product.setName(request.getName());
        product.setPrice(request.getPrice());
        product.setQuantity(request.getQuantity());
        product.setDescription(request.getDescription());
        product.setCategory(request.getCategory());

        productRepository.save(product);

        return mapToResponse(product);
    }

    // --- Product by id ---
    @Transactional(readOnly = true)
    public ProductResponse getProductById(Long id) {
        Product product = productRepository.findById(id)
            .orElseThrow(() -> EntityNotFoundException.forId(Product.class, id));
        return mapToResponse(product);
    }

    // --- List products with filtering and paging ---
    public Page<ProductResponse> getProducts(String nameKeyword, String categoryKeyword, int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("name").ascending());

        Page<Product> products = productRepository
            .findByNameContainingIgnoreCaseAndCategoryContainingIgnoreCase(
                nameKeyword == null ? "" : nameKeyword,
                categoryKeyword == null ? "" : categoryKeyword,
                pageable);

        return products.map(this::mapToResponse);
    }

    // --- Delete product ---
    @Transactional
    public void deleteProduct(Long id) {
        Product product = productRepository.findById(id)
            .orElseThrow(() -> EntityNotFoundException.forId(Product.class, id));

        productRepository.delete(product);
    }

    private ProductResponse mapToResponse(Product product) {
        return ProductResponse.builder()
            .id(product.getId())
            .name(product.getName())
            .price(product.getPrice())
            .quantity(product.getQuantity())
            .description(product.getDescription())
            .category(product.getCategory())
            .build();
    }
}
