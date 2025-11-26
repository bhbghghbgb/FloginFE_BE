package com.flogin.backend.config;

import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.security.Key;
import java.util.Date;

@Component
public class JwtUtil {

    private final Key jwtSecret;

    private final long jwtExpirationMs;

    public JwtUtil(@Value("${jwt.secret}") String secret,
                   @Value("${jwt.expiration}") long jwtExpirationMs) {
        // Chuyển secret thành Key an toàn
        this.jwtSecret = Keys.hmacShaKeyFor(secret.getBytes());
        this.jwtExpirationMs = jwtExpirationMs;
    }

    // Tạo token
    public String generateToken(String username) {
        return Jwts.builder()
            .setSubject(username)
            .setIssuedAt(new Date())
            .setExpiration(new Date(System.currentTimeMillis() + jwtExpirationMs))
            .signWith(SignatureAlgorithm.HS256, jwtSecret)
            .compact();
    }

    // Lấy username từ token
    public String getUsernameFromToken(String token) {
        return Jwts.parser()
            .setSigningKey(jwtSecret)
            .build()
            .parseClaimsJws(token)
            .getBody()
            .getSubject();
    }

    // Validate token
    public boolean validateToken(String token) {
        try {
            Jwts.parser().setSigningKey(jwtSecret).build().parseClaimsJws(token);
            return true;
        } catch (JwtException | IllegalArgumentException e) {
            return false;
        }
    }
}
