package com.quantumshop.orderservice.dto;
import com.quantumshop.orderservice.model.OrderEntity;
import java.time.LocalDateTime;

public record OrderResponse(Long id, String productName, Integer quantity,
                            String status, LocalDateTime createdAt) {

    public static OrderResponse from(OrderEntity o) {
        return new OrderResponse(o.getId(), o.getProductName(), o.getQuantity(),
                o.getStatus(), o.getCreatedAt());
    }
}
