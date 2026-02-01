package com.example.demo.order.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

public record OrderResponseDTO(
        Long id,
        LocalDateTime createdAt,
        String status,
        BigDecimal totalPrice,
        List<OrderItemResponse> items
) {
    public record OrderItemResponse(
            String productTitle,
            Integer quantity,
            BigDecimal pricePerUnit
    ) {}
}
