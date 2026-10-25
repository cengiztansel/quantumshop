package com.quantumshop.productservice.controller;
import com.quantumshop.productservice.dto.request.ProductRequest;
import com.quantumshop.productservice.dto.response.ProductResponse;
import com.quantumshop.productservice.entity.Product;
import com.quantumshop.productservice.exception.ProductNotFoundException;
import com.quantumshop.productservice.service.ProductService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.CachePut;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import com.quantumshop.productservice.dto.ProductFilter;
import com.quantumshop.productservice.repository.*;
import com.quantumshop.productservice.mapper.*;

@RestController
@RequestMapping("/api/v1/products")
@RequiredArgsConstructor
public class ProductController {

    private final ProductService productService;

    /*** CREATE PRODUCT 
    @PostMapping
    public ResponseEntity<ProductResponse> createProduct(@Valid @RequestBody ProductRequest request) {
        ProductResponse response = productService.createProduct(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    } */

    @PostMapping
    public ResponseEntity<ProductResponse> createProduct(@Valid @RequestBody ProductRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(productService.createProduct(request));
    }

    // GET PRODUCT BY ID    --> DAHA ÖNCE YAZDIĞIMIZ METHOD:
    @GetMapping("/{id}")
    public ResponseEntity<ProductResponse> getProductById(@PathVariable Long id) {
        return ResponseEntity.ok(productService.getProductById(id));
    }

    /*** GET ALL PRODUCTS (Pagination) 
    @GetMapping
    public ResponseEntity<List<ProductResponse>> getAllProducts() {
        return ResponseEntity.ok(productService.getAllProducts());
    }  */

 /*   // GET ALL (Pagination)
    @GetMapping
    public ResponseEntity<Page<ProductResponse>> getAll(Pageable pageable) {
        return ResponseEntity.ok(productService.getAll(pageable));
    }  */

    /*** UPDATE PRODUCT */
    @CachePut(value="products", key="#id")
    @PutMapping("/{id}")
    public ResponseEntity<ProductResponse> updateProduct(@PathVariable Long id, @Valid @RequestBody ProductRequest request) {
        return ResponseEntity.ok(productService.updateProduct(id, request));
    }

    /*** DELETE PRODUCT */
    @CacheEvict(value="products", key="#id")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteProduct(@PathVariable Long id) {
        productService.deleteProduct(id);
        return ResponseEntity.noContent().build();
    }

    /* SEARCH
    @GetMapping("/search")
    public ResponseEntity<Page<ProductResponse>> search(@RequestParam String keyword, Pageable pageable) {
        return ResponseEntity.ok(productService.search(keyword, pageable));
    }
  */    // SEARCH
    @GetMapping
    public ResponseEntity<Page<ProductResponse>> search(ProductFilter filter, Pageable pageable){
        return ResponseEntity.ok(productService.search(filter,pageable));
    }


}
