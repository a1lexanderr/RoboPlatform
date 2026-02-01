package com.example.demo.security.jwt;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import io.micrometer.common.util.StringUtils;
import jakarta.annotation.PostConstruct;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.util.*;
import java.util.stream.Collectors;

@Component
@Slf4j
public class JwtTokenProvider {
    @Value("${jwt.secret}")
    private String jwtSecret;

    @Value("${jwt.expiration.access}")
    private Long jwtExpiration;

    @Value("${jwt.expiration.refresh}")
    private Long refreshExpiration;

    @PostConstruct
    public void init() {
        if (StringUtils.isBlank(jwtSecret) || jwtExpiration == null || refreshExpiration == null) {
            throw new IllegalStateException("JWT configuration is incomplete");
        }
    }

    public String generateAccessToken(UserDetails userDetails) {
        if (userDetails == null) {
            throw new IllegalArgumentException("UserDetails cannot be null");
        }

        Map<String, Object> claims = new HashMap<>();
        claims.put("roles", userDetails.getAuthorities().stream()
                .map(GrantedAuthority::getAuthority)
                .collect(Collectors.toList()));

        return buildToken(claims, userDetails.getUsername(), jwtExpiration);
    }

    public String generateRefreshToken(UserDetails userDetails) {
        if (userDetails == null) {
            throw new IllegalArgumentException("UserDetails cannot be null");
        }
        return buildToken(new HashMap<>(), userDetails.getUsername(), refreshExpiration);
    }

    private String buildToken(Map<String, Object> claims, String subject, Long expiration) {
        if (StringUtils.isBlank(subject)) {
            throw new IllegalArgumentException("Subject cannot be blank");
        }

        return Jwts.builder()
                .claims(claims)
                .subject(subject)
                .issuedAt(new Date())
                .expiration(new Date(System.currentTimeMillis() + expiration))
                .signWith(getSigningKey())
                .compact();
    }

    private SecretKey getSigningKey() {
        if (!StringUtils.isBlank(jwtSecret)) {
            try {
                byte[] keyBytes = Decoders.BASE64.decode(jwtSecret);
                if (keyBytes.length * 8 >= 256) {
                    return Keys.hmacShaKeyFor(keyBytes);
                }
            } catch (Exception e) {
                log.warn("Error using configured JWT secret, falling back to generated key", e);
            }
        }

        return Jwts.SIG.HS256.key().build();
    }

    public String getUsernameFromToken(String token) {
        if (StringUtils.isBlank(token)) {
            throw new IllegalArgumentException("Token cannot be blank");
        }
        return extractAllClaims(token).getSubject();
    }

    public boolean validateToken(String token, UserDetails userDetails) {
        if (StringUtils.isBlank(token) || userDetails == null) {
            return false;
        }

        try {
            Claims claims = extractAllClaims(token);
            return !isTokenExpired(claims) &&
                    userDetails.getUsername().equals(claims.getSubject());
        } catch (JwtException | IllegalArgumentException e) {
            return false;
        }
    }


    private Claims extractAllClaims(String token) {
        try {
            return Jwts.parser()
                    .verifyWith(getSigningKey())
                    .build()
                    .parseSignedClaims(token)
                    .getPayload();
        } catch (JwtException e) {
            throw new SecurityException("Invalid JWT token", e);
        }
    }

    private boolean isTokenExpired(Claims claims) {
        return claims.getExpiration().before(new Date());
    }
}
