package com.quantumshop.productservice.mapper;
import com.quantumshop.productservice.dto.request.ProductRequest;
import com.quantumshop.productservice.dto.response.ProductResponse;
import com.quantumshop.productservice.entity.Product;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface ProductMapper {

    Product toEntity(ProductRequest request);
    ProductResponse toResponse(Product product);

}


