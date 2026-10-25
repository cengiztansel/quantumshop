package com.quantumshop.orderservice.service;
import com.quantumshop.orderservice.dto.OrderRequest;
import com.quantumshop.orderservice.dto.StatusRequest;
import com.quantumshop.orderservice.exception.InvalidOrderStateException;
import com.quantumshop.orderservice.exception.OrderNotFoundException;
import com.quantumshop.orderservice.model.OrderEntity;
import com.quantumshop.orderservice.model.OrderStatus;
import com.quantumshop.orderservice.repository.OrderRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;

@Service
public class OrderService {

    private final OrderRepository repository;

    public OrderService(OrderRepository repository) {
        this.repository = repository;
    }

    public List<OrderEntity> findAll(String status) {
        if (status == null || status.isBlank()) {
            return repository.findAllByOrderByIdDesc();
        }
        return repository.findByStatusOrderByIdDesc(OrderStatus.parse(status).name());
    }

    public OrderEntity findById(Long id) {
        return repository.findById(id).orElseThrow(() -> new OrderNotFoundException(id));
    }

    @Transactional
    public OrderEntity create(OrderRequest request) {
        OrderEntity order = new OrderEntity(
                requireName(request.productName()),
                requireQuantity(request.quantity()),
                OrderStatus.CREATED.name());
        return repository.save(order);
    }

    // PUT: içerik sadece CREATED durumunda değiştirilebilir
    @Transactional
    public OrderEntity update(Long id, OrderRequest request) {
        OrderEntity order = findById(id);
        OrderStatus current = OrderStatus.parse(order.getStatus());
        if (current != OrderStatus.CREATED) {
            throw new InvalidOrderStateException(
                    "Only CREATED orders can be modified, current status: " + current);
        }
        order.setProductName(requireName(request.productName()));
        order.setQuantity(requireQuantity(request.quantity()));
        return repository.save(order);
    }

    // PATCH /status: durum makinesi kurallarına göre geçiş
    @Transactional
    public OrderEntity changeStatus(Long id, StatusRequest request) {
        OrderEntity order = findById(id);
        OrderStatus current = OrderStatus.parse(order.getStatus());
        OrderStatus next = OrderStatus.parse(request.status());
        if (!current.canTransitionTo(next)) {
            throw new InvalidOrderStateException(
                    "Cannot change status from " + current + " to " + next
                            + ". Allowed: " + current.allowedNext());
        }
        order.setStatus(next.name());
        return repository.save(order);
    }

    // DELETE: sadece CREATED veya CANCELLED sipariş silinebilir
    @Transactional
    public void delete(Long id) {
        OrderEntity order = findById(id);
        OrderStatus current = OrderStatus.parse(order.getStatus());
        if (current != OrderStatus.CREATED && current != OrderStatus.CANCELLED) {
            throw new InvalidOrderStateException(
                    "Only CREATED or CANCELLED orders can be deleted, current status: " + current);
        }
        repository.delete(order);
    }

    private String requireName(String value) {
        if (value == null || value.isBlank()) {
            throw new IllegalArgumentException("productName must not be blank");
        }
        return value.trim();
    }

    private Integer requireQuantity(Integer value) {
        if (value == null || value < 1) {
            throw new IllegalArgumentException("quantity must be at least 1");
        }
        return value;
    }
}
