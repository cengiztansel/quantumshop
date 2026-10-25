package com.quantumshop.productservice.repository;
import com.quantumshop.productservice.entity.Product;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

public interface ProductRepository extends JpaRepository<Product, Long>, JpaSpecificationExecutor<Product> {
    Optional<Product> findBySku(String sku);
    Page<Product> findByNameContainingIgnoreCase(String keyword, Pageable pageable);
    boolean existsBySku(String sku);
}
/*
package com.quantumshop.productservice.repository;
import com.quantumshop.productservice.entity.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface ProductRepository extends JpaRepository<Product, Long> {
    Optional<Product> findBySku(String sku);
    boolean existsBySku(String sku);
    List<Product> findByNameContainingIgnoreCase(String keyword);
    List<Product> findByActiveTrue();
}

 */