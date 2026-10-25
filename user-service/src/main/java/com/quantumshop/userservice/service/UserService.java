package com.quantumshop.userservice.service;
import com.quantumshop.userservice.dto.UserRequest;
import com.quantumshop.userservice.exception.UserNotFoundException;
import com.quantumshop.userservice.exception.UsernameAlreadyTakenException;
import com.quantumshop.userservice.model.UserEntity;
import com.quantumshop.userservice.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;

@Service
public class UserService {

    private final UserRepository repository;

    public UserService(UserRepository repository) {
        this.repository = repository;
    }

    public List<UserEntity> findAll() {
        return repository.findAll();
    }

    public UserEntity findById(Long id) {
        return repository.findById(id).orElseThrow(() -> new UserNotFoundException(id));
    }

    @Transactional
    public UserEntity create(UserRequest request) {
        UserEntity user = new UserEntity();
        applyUsername(user, request.getUsername());
        user.setEmail(requireText(request.getEmail(), "email"));
        user.setRole("USER");
        return repository.save(user);
    }

    // PUT: tam güncelleme, iki alan da zorunlu
    @Transactional
    public UserEntity update(Long id, UserRequest request) {
        UserEntity user = findById(id);
        applyUsername(user, request.getUsername());
        user.setEmail(requireText(request.getEmail(), "email"));
        return repository.save(user);
    }

    // PATCH: sadece gönderilen alanlar güncellenir
    @Transactional
    public UserEntity patch(Long id, UserRequest request) {
        UserEntity user = findById(id);
        if (request.getUsername() != null) {
            applyUsername(user, request.getUsername());
        }
        if (request.getEmail() != null) {
            user.setEmail(requireText(request.getEmail(), "email"));
        }
        return repository.save(user);
    }

    @Transactional
    public void delete(Long id) {
        if (!repository.existsById(id)) {
            throw new UserNotFoundException(id);
        }
        repository.deleteById(id);
    }

    private void applyUsername(UserEntity user, String raw) {
        String name = requireText(raw, "username");
        if (!name.equals(user.getUsername()) && repository.existsByUsername(name)) {
            throw new UsernameAlreadyTakenException(name);
        }
        user.setUsername(name);
    }

    private String requireText(String value, String field) {
        if (value == null || value.isBlank()) {
            throw new IllegalArgumentException(field + " must not be blank");
        }
        return value.trim();
    }
}
