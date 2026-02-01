package com.example.demo.product.dto;

import java.math.BigDecimal;

public record ProductCreateDTO(
        String title,
        String description,
        BigDecimal price,
        Integer stockQuantity,
        String category
) {}
