
package com.quantumshop.productservice.service;
import com.quantumshop.productservice.dto.ProductFilter;
import com.quantumshop.productservice.dto.request.ProductRequest;
import com.quantumshop.productservice.dto.response.ProductResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import java.util.List;

public interface ProductService {
    ProductResponse createProduct(ProductRequest request);
    ProductResponse getProductById(Long id);
    List<ProductResponse> getAllProducts();
    ProductResponse updateProduct(Long id, ProductRequest request);
    void deleteProduct(Long id);
    Page<ProductResponse> search(String keyword, Pageable pageable);
    Page<ProductResponse> search(ProductFilter filter, Pageable pageable);
}


/*
package com.quantumshop.productservice.service;
import com.quantumshop.productservice.dto.request.ProductRequest;
import com.quantumshop.productservice.dto.response.ProductResponse;
import com.quantumshop.productservice.exception.ProductNotFoundException;
import com.quantumshop.productservice.mapper.ProductMapper;
import com.quantumshop.productservice.messaging.ProductEventProducer;
import com.quantumshop.productservice.entity.Product;
import com.quantumshop.productservice.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ProductService {

    private final ProductRepository productRepository;
    private final ProductMapper productMapper;
    private final ProductEventProducer productEventProducer;

    // CREATE
    public ProductResponse createProduct(ProductRequest request) {
        Product product = productMapper.toEntity(request);
        Product savedProduct = productRepository.save(product);
        productEventProducer.sendProductCreatedEvent(
                "PRODUCT_CREATED : " + savedProduct.getId());
        return productMapper.toResponse(savedProduct);
    }

    // GET BY ID
    public ProductResponse getProductById(Long id) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ProductNotFoundException("Product not found : " + id));
        return productMapper.toResponse(product);
    }

    // GET ALL
    public List<ProductResponse> getAllProducts() {

        return productRepository.findAll()
                .stream()
                .map(productMapper::toResponse)
                .collect(Collectors.toList());
    }

    // UPDATE
    public ProductResponse updateProduct(Long id, ProductRequest request) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ProductNotFoundException("Product not found : " + id));
        product.setSku(request.getSku());
        product.setName(request.getName());
        product.setDescription(request.getDescription());
        product.setPrice(request.getPrice());
        product.setStockQuantity(request.getStockQuantity());
        Product updatedProduct = productRepository.save(product);
        return productMapper.toResponse(updatedProduct);
    }

    // DELETE
    public void deleteProduct(Long id) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ProductNotFoundException("Product not found : " + id));
        productRepository.delete(product);
    }
}
*/