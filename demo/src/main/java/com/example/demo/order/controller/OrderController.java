package com.example.demo.order.controller;

import com.example.demo.order.dto.OrderRequestDTO;
import com.example.demo.order.dto.OrderResponseDTO;
import com.example.demo.order.service.OrderService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;

@RestController
@RequestMapping("/api/v1/orders")
@RequiredArgsConstructor
public class OrderController {

    private final OrderService orderService;

    @PostMapping
    public ResponseEntity<OrderResponseDTO> createOrder(@RequestBody OrderRequestDTO request, Principal principal) {
        return ResponseEntity.ok(orderService.createOrder(request, principal.getName()));
    }
}
