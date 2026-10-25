package com.quantumshop.orderservice.controller;
import com.quantumshop.orderservice.model.OrderEntity;
import com.quantumshop.orderservice.repository.OrderRepository;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;
import java.util.List;

import com.quantumshop.orderservice.dto.OrderRequest;
import com.quantumshop.orderservice.dto.OrderResponse;
import com.quantumshop.orderservice.dto.StatusRequest;
import com.quantumshop.orderservice.service.OrderService;
import org.springframework.http.ResponseEntity;

@RestController
@RequestMapping("/api/orders")
public class OrderController {

    private final OrderService service;

    public OrderController(OrderService service) {
        this.service = service;
    }

    @GetMapping
    public List<OrderResponse> all(@RequestParam(required = false) String status) {
        return service.findAll(status).stream().map(OrderResponse::from).toList();
    }

    @GetMapping("/{id}")
    public OrderResponse one(@PathVariable Long id) {
        return OrderResponse.from(service.findById(id));
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public OrderResponse create(@RequestBody OrderRequest request) {
        return OrderResponse.from(service.create(request));
    }

    @PutMapping("/{id}")
    public OrderResponse update(@PathVariable Long id, @RequestBody OrderRequest request) {
        return OrderResponse.from(service.update(id, request));
    }

    @PatchMapping("/{id}/status")
    public OrderResponse changeStatus(@PathVariable Long id, @RequestBody StatusRequest request) {
        return OrderResponse.from(service.changeStatus(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        service.delete(id);
        return ResponseEntity.noContent().build();
    }
}
