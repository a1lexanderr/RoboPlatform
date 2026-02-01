package com.example.demo.order.service;

import com.example.demo.order.domain.Order;
import com.example.demo.order.domain.OrderItem;
import com.example.demo.order.domain.OrderStatus;
import com.example.demo.order.dto.OrderRequestDTO;
import com.example.demo.order.dto.OrderResponseDTO;
import com.example.demo.order.repository.OrderRepository;
import com.example.demo.product.domain.Product;
import com.example.demo.product.repository.ProductRepository;
import com.example.demo.user.domain.User;
import com.example.demo.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class OrderService {

    private final OrderRepository orderRepository;
    private final ProductRepository productRepository;
    private final UserRepository userRepository;

    @Transactional
    public OrderResponseDTO createOrder(OrderRequestDTO request, String username) {
        User buyer = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Order order = new Order();
        order.setBuyer(buyer);
        order.setCreatedAt(LocalDateTime.now());
        order.setStatus(OrderStatus.NEW);

        List<OrderItem> itemsEntity = new ArrayList<>();
        BigDecimal total = BigDecimal.ZERO;

        for (OrderRequestDTO.OrderItemRequest itemReq : request.items()) {
            Product product = productRepository.findById(itemReq.productId())
                    .orElseThrow(() -> new RuntimeException("Product not found"));

            if (product.getStockQuantity() < itemReq.quantity()) {
                throw new RuntimeException("Out of stock: " + product.getTitle());
            }

            product.setStockQuantity(product.getStockQuantity() - itemReq.quantity());
            productRepository.save(product);

            OrderItem orderItem = OrderItem.builder()
                    .order(order)
                    .product(product)
                    .quantity(itemReq.quantity())
                    .pricePerUnit(product.getPrice())
                    .build();

            itemsEntity.add(orderItem);
            total = total.add(product.getPrice().multiply(BigDecimal.valueOf(itemReq.quantity())));
        }

        order.setItems(itemsEntity);
        order.setTotalPrice(total);

        return mapToResponse(orderRepository.save(order));
    }

    private OrderResponseDTO mapToResponse(Order order) {
        List<OrderResponseDTO.OrderItemResponse> itemDtos = order.getItems().stream()
                .map(item -> new OrderResponseDTO.OrderItemResponse(
                        item.getProduct().getTitle(),
                        item.getQuantity(),
                        item.getPricePerUnit()
                ))
                .toList();

        return new OrderResponseDTO(
                order.getId(),
                order.getCreatedAt(),
                order.getStatus().name(),
                order.getTotalPrice(),
                itemDtos
        );
    }
}
