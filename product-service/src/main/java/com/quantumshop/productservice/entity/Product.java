package com.quantumshop.productservice.entity;
import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;


@Entity
@Table(name = "products")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Product {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable=false,unique=true)
    @NotBlank
    @Size(max=50)
    private String sku;

    @Column(nullable=false, length = 150)
    @NotBlank
    @Size(max=150)
    private String name;

    @Column(length=2000)
    private String description;

    @Column(nullable = false, precision = 12, scale = 2)
    @Positive
    private BigDecimal price;

    @Column(nullable = false)
    @PositiveOrZero
    private Integer stockQuantity;

    @Column(nullable = false)
    @Builder.Default
    private Boolean active=true;

    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(nullable = false)
    private LocalDateTime updatedAt;

    @PrePersist
    void prePersist(){
        createdAt=LocalDateTime.now();
        updatedAt=LocalDateTime.now();
    }

    @PreUpdate
    void preUpdate(){
        updatedAt=LocalDateTime.now();
    }

//    public Product() {
//    }


    ///////////////////////////////////////////////////////////////

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public @NotBlank @Size(max = 50) String getSku() {
        return sku;
    }

    public void setSku(@NotBlank @Size(max = 50) String sku) {
        this.sku = sku;
    }

    public @NotBlank @Size(max = 150) String getName() {
        return name;
    }

    public void setName(@NotBlank @Size(max = 150) String name) {
        this.name = name;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public @Positive BigDecimal getPrice() {
        return price;
    }

    public void setPrice(@Positive BigDecimal price) {
        this.price = price;
    }

    public @PositiveOrZero Integer getStockQuantity() {
        return stockQuantity;
    }

    public void setStockQuantity(@PositiveOrZero Integer stockQuantity) {
        this.stockQuantity = stockQuantity;
    }

    public Boolean getActive() {
        return active;
    }

    public void setActive(Boolean active) {
        this.active = active;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }
}