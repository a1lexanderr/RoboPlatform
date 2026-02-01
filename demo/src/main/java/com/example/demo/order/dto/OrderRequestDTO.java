package com.example.demo.order.dto;

import java.util.List;

public record OrderRequestDTO(
        List<OrderItemRequest> items
) {
    public record OrderItemRequest(
            Long productId,
            Integer quantity
    ) {}
}