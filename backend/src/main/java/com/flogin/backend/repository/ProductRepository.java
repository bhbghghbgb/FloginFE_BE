package com.flogin.backend.repository;

import com.flogin.backend.entity.Product;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {

    // Tìm sản phẩm theo tên (có thể dùng LIKE)
    Page<Product> findByNameContainingIgnoreCaseAndCategoryContainingIgnoreCaseAndActiveTrue(
        String name, String category, Pageable pageable
    );

    // Kiểm tra sản phẩm đã tồn tại theo tên
    boolean existsByName(String name);
}