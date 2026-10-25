package com.quantumshop.productservice.specification;
import com.quantumshop.productservice.dto.ProductFilter;
import com.quantumshop.productservice.entity.Product;
import jakarta.persistence.criteria.Predicate;
import org.springframework.data.jpa.domain.Specification;
import java.util.ArrayList;
import java.util.List;

public class ProductSpecification {

    public static Specification<Product> filter(ProductFilter filter){
        return (root, query, criteriaBuilder) -> {
            List<Predicate> predicates = new ArrayList<>();

            if(filter.getKeyword()!=null && !filter.getKeyword().isBlank()){
predicates.add(criteriaBuilder.like(criteriaBuilder.lower(root.get("name")), "%" + filter.getKeyword().toLowerCase() + "%") );
            }

            if(filter.getMinPrice()!=null){
predicates.add(criteriaBuilder.greaterThanOrEqualTo(root.get("price"), filter.getMinPrice()) );
            }

            if(filter.getMaxPrice()!=null){
predicates.add(criteriaBuilder.lessThanOrEqualTo(root.get("price"),filter.getMaxPrice()) );
            }

            if(filter.getActive()!=null){
predicates.add(criteriaBuilder.equal(root.get("active"), filter.getActive()) );
            }
            return criteriaBuilder.and(predicates.toArray(new Predicate[0]) );
        };
    }
}
