package com.flogin.backend.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.*;
import org.hibernate.proxy.HibernateProxy;

import java.util.Objects;

@Getter
@Setter
@ToString
@RequiredArgsConstructor
@Builder
@Entity
@Table(name = "products")
@AllArgsConstructor
public class Product {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 100)
    @Size(min = 3, max = 100, message = "Product name must be 3-100 characters")
    private String name;

    @Column(nullable = false)
    @Min(value = 1, message = "Price must be greater than 0")
    @Max(value = 999_999_999, message = "Price must be less than 999,999,999")
    private Long price;

    @Column(nullable = false)
    @Min(value = 0, message = "Quantity must be >= 0")
    @Max(value = 99_999, message = "Quantity must be <= 99,999")
    private Integer quantity;

    @Column(length = 500)
    @Size(max = 500, message = "Description can be up to 500 characters")
    private String description;

    @Column(nullable = false)
    @NotBlank(message = "Category must not be blank")
    private String category;

    @Override
    public final boolean equals(Object o) {
        if (this == o) return true;
        if (o == null) return false;
        Class<?> oEffectiveClass = o instanceof HibernateProxy ? ((HibernateProxy) o).getHibernateLazyInitializer().getPersistentClass() : o.getClass();
        Class<?> thisEffectiveClass = this instanceof HibernateProxy ? ((HibernateProxy) this).getHibernateLazyInitializer().getPersistentClass() : this.getClass();
        if (thisEffectiveClass != oEffectiveClass) return false;
        Product product = (Product) o;
        return getId() != null && Objects.equals(getId(), product.getId());
    }

    @Override
    public final int hashCode() {
        return this instanceof HibernateProxy ? ((HibernateProxy) this).getHibernateLazyInitializer().getPersistentClass().hashCode() : getClass().hashCode();
    }
}
