package com.quantumshop.productservice.service.impl;
import com.quantumshop.productservice.dto.ProductFilter;
import com.quantumshop.productservice.dto.request.ProductRequest;
import com.quantumshop.productservice.dto.response.ProductResponse;
import com.quantumshop.productservice.entity.Product;
import com.quantumshop.productservice.exception.ProductNotFoundException;
import com.quantumshop.productservice.mapper.ProductMapper;
import com.quantumshop.productservice.messaging.ProductEventProducer;
import com.quantumshop.productservice.repository.ProductRepository;
import com.quantumshop.productservice.service.ProductService;
import com.quantumshop.productservice.specification.ProductSpecification;
import lombok.RequiredArgsConstructor;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.GetMapping;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ProductServiceImpl implements ProductService {

    private final ProductRepository repository;
    private final ProductMapper mapper;
//    private final ProductEventProducer producer;

    public Page<ProductResponse> search(String keyword, Pageable pageable) {
    return repository.findByNameContainingIgnoreCase(keyword, pageable).map(mapper::toResponse);
}

    public Page<ProductResponse> search(ProductFilter filter, Pageable pageable){
        return repository.findAll(ProductSpecification.filter(filter), pageable).map(mapper::toResponse);
    }

    @Override
    public ProductResponse createProduct(ProductRequest request) {
        Product entity = mapper.toEntity(request);
        Product saved = repository.save(entity);
      //  producer.sendProductCreatedEvent( "PRODUCT CREATED : " + saved.getId());
        return mapper.toResponse(saved);
    }

    @Override
    @Cacheable(value = "products", key = "#id")
    public ProductResponse getProductById(Long id) {
        System.out.println("DATABASE HIT -> " + id);
        Product product = repository.findById(id).orElseThrow(() -> new ProductNotFoundException("Product not found : " + id));
        return mapper.toResponse(product);
    }

    @Override
    public List<ProductResponse> getAllProducts() {
        return repository.findAll()
                .stream()
                .map(mapper::toResponse)
                .toList();
    }

    @Override
    public ProductResponse updateProduct(Long id, ProductRequest request) {
        Product product = repository.findById(id)
                .orElseThrow(() ->
                        new ProductNotFoundException(
                                "Product not found : " + id));
        product.setSku(request.getSku());
        product.setName(request.getName());
        product.setDescription(request.getDescription());
        product.setPrice(request.getPrice());
        product.setStockQuantity(request.getStockQuantity());
        Product updated = repository.save(product);
        return mapper.toResponse(updated);
    }

    @Override
    public void deleteProduct(Long id) {
        Product product = repository.findById(id)
                .orElseThrow(() ->
                        new ProductNotFoundException(
                                "Product not found : " + id));
        repository.delete(product);
    }
}
