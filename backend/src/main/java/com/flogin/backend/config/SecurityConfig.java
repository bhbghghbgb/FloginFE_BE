package com.flogin.backend.config;

import java.util.Arrays;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.HttpStatusEntryPoint;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.security.web.header.writers.XXssProtectionHeaderWriter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

@Configuration
@RequiredArgsConstructor
@EnableMethodSecurity
public class SecurityConfig {

  private final JwtAuthenticationFilter jwtAuthenticationFilter;

  @Bean
  public SecurityFilterChain securityFilterChain(HttpSecurity http)
    throws Exception {
    http
      .csrf(AbstractHttpConfigurer::disable) // Tắt CSRF (Thường dùng cho Stateless API)
      .cors(cors -> cors.configurationSource(corsConfigurationSource())) // Áp dụng CORS
      .sessionManagement(sm ->
        sm.sessionCreationPolicy(SessionCreationPolicy.STATELESS)
      )
      .authorizeHttpRequests(auth ->
        auth
          // Cho phép truy cập public cho Login và Swagger/OpenAPI
          .requestMatchers(
            "/api/auth/**",
            "/swagger-ui.html",
            "/swagger-ui/**",
            "/v3/api-docs/**",
            "/actuator/**"
          )
          .permitAll()
          .requestMatchers("/api/products/**")
          .authenticated()
          // Tất cả các request khác phải được xác thực
          .anyRequest()
          .authenticated()
      )
      .exceptionHandling(
        exceptions ->
          exceptions.authenticationEntryPoint(
            new HttpStatusEntryPoint(HttpStatus.UNAUTHORIZED)
          ) // Returns 401 for
        // unauthenticated
      )
      .addFilterBefore(
        jwtAuthenticationFilter,
        UsernamePasswordAuthenticationFilter.class
      )
      .headers(headers ->
        headers
          .contentSecurityPolicy(csp ->
            csp.policyDirectives("default-src 'self'")
          )
          .frameOptions(frame -> frame.deny())
          .xssProtection(xss ->
            xss.headerValue(
              XXssProtectionHeaderWriter.HeaderValue.ENABLED_MODE_BLOCK
            )
          )
          .contentTypeOptions(contentType -> {})
      );

    return http.build();
  }

  /**
   * Cấu hình CORS
   */
  @Bean
  public CorsConfigurationSource corsConfigurationSource() {
    CorsConfiguration configuration = new CorsConfiguration();
    configuration.setAllowedOriginPatterns(
      Arrays.asList(
        "http://localhost:3000",
        "http://localhost:4173",
        "http://localhost:8080"
      )
    );
    configuration.setAllowedMethods(
      Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS")
    );
    configuration.setAllowedHeaders(
      Arrays.asList("Authorization", "Content-Type", "X-Requested-With")
    );
    configuration.setExposedHeaders(Arrays.asList("Authorization"));
    configuration.setAllowCredentials(true); // Important for cookies/auth
    configuration.setMaxAge(3600L);

    UrlBasedCorsConfigurationSource source =
      new UrlBasedCorsConfigurationSource();
    source.registerCorsConfiguration("/**", configuration);
    return source;
  }

  @Bean
  public AuthenticationManager authenticationManager(
    AuthenticationConfiguration config
  ) throws Exception {
    return config.getAuthenticationManager();
  }
}
