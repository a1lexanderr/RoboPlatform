package com.example.demo.order.repository;

import com.example.demo.order.domain.Order;
import com.example.demo.user.domain.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface OrderRepository extends JpaRepository<Order, Long> {
    List<Order> findByBuyerOrderByCreatedAtDesc(User buyer);


}
