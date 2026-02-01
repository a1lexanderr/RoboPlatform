package com.example.demo.product.dto;

import java.math.BigDecimal;
import java.util.List;

public record ProductDTO(
        Long id,
        String title,
        String description,
        BigDecimal price,
        Integer stockQuantity,
        String category,
        String sellerUsername,
        List<String> imageUrls
) {
}
