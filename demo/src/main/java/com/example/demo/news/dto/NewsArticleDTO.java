package com.example.demo.news.dto;

import java.time.LocalDateTime;

public record NewsArticleDTO(
        Long id,
        String title,
        String excerpt,
        String content,
        String imageUrl,
        LocalDateTime createdAt
) {}
