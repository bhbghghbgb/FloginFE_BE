package com.flogin.backend.config;

import io.swagger.v3.oas.models.Components;
import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.security.SecurityRequirement;
import io.swagger.v3.oas.models.security.SecurityScheme;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class OpenApiConfig {

    // Tên schema bảo mật (sẽ hiển thị trên nút Authorize)
    private static final String SCHEME_NAME = "BearerAuth";
    private static final String SCHEME = "bearer";


    @Bean
    public OpenAPI customOpenAPI() {
        return new OpenAPI()
            .info(new Info()
                .title("Kiểm Thử Phần Mềm - Product Management API")
                .version("1.0")
                .description("API cho chức năng Đăng nhập và Quản lý Sản phẩm. Dùng để thực hiện Kiểm thử Back-end.")
            )
            // 1. Định nghĩa Security Scheme (JWT/Bearer)
            .components(new Components()
                .addSecuritySchemes(SCHEME_NAME, createSecurityScheme())
            )
            // 2. Yêu cầu Security (Áp dụng cho mọi API trừ những cái đã public)
            .addSecurityItem(new SecurityRequirement().addList(SCHEME_NAME));
    }

    private SecurityScheme createSecurityScheme() {
        return new SecurityScheme()
            .name(SCHEME_NAME)
            .type(SecurityScheme.Type.HTTP)
            .scheme(SCHEME)
            .bearerFormat("JWT")
            .in(SecurityScheme.In.HEADER)
            .description("Token JWT: Nhập token vào trường sau (Ví dụ: Bearer eyJhbGci... )");
    }

}