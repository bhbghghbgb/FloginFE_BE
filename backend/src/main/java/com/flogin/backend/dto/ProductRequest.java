package com.flogin.backend.dto;

import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProductRequest {

    @NotBlank(message = "Product name must not be blank")
    @Size(min = 3, max = 100, message = "Product name must be 3-100 characters")
    private String name;

    @NotNull(message = "Price is required")
    @Min(value = 1, message = "Price must be greater than 0")
    @Max(value = 999_999_999, message = "Price must be less than 999,999,999")
    private Long price;

    @NotNull(message = "Quantity is required")
    @Min(value = 0, message = "Quantity must be >= 0")
    @Max(value = 99_999, message = "Quantity must be <= 99,999")
    private Integer quantity;

    @Size(max = 500, message = "Description can be up to 500 characters")
    private String description;

    @NotBlank(message = "Category must not be blank")
    private String category;
}
