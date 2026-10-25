package com.quantumshop.orderservice.repository;
import com.quantumshop.orderservice.model.OrderEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface OrderRepository extends JpaRepository<OrderEntity, Long> {
    List<OrderEntity> findAllByOrderByIdDesc();
    List<OrderEntity> findByStatusOrderByIdDesc(String status);
}
