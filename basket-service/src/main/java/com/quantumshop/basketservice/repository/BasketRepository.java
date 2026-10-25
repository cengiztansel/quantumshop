package com.quantumshop.basketservice.repository;

import com.quantumshop.basketservice.model.BasketItem;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface BasketRepository extends CrudRepository<BasketItem, String> {
    // CrudRepository sayesinde save() ve findAll() metotları hazır gelir.
}
