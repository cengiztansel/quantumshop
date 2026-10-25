package com.quantumshop.userservice.controller;
import com.quantumshop.userservice.dto.UserRequest;
import com.quantumshop.userservice.dto.UserResponse;
import com.quantumshop.userservice.service.UserService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserService service;

    public UserController(UserService service) {
        this.service = service;
    }

    @GetMapping
    public List<UserResponse> all() {
        return service.findAll().stream().map(UserResponse::new).collect(Collectors.toList());
    }

    @GetMapping("/{id}")
    public UserResponse one(@PathVariable Long id) {
        return new UserResponse(service.findById(id));
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public UserResponse create(@RequestBody UserRequest request) {
        return new UserResponse(service.create(request));
    }

    @PutMapping("/{id}")
    public UserResponse update(@PathVariable Long id, @RequestBody UserRequest request) {
        return new UserResponse(service.update(id, request));
    }

    @PatchMapping("/{id}")
    public UserResponse patch(@PathVariable Long id, @RequestBody UserRequest request) {
        return new UserResponse(service.patch(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        service.delete(id);
        return ResponseEntity.noContent().build();
    }
}




/*
package com.quantumshop.userservice.controller;
import java.util.List;
import org.springframework.web.bind.annotation.*;
import com.quantumshop.userservice.model.UserEntity;
import com.quantumshop.userservice.service.UserService;
import java.util.stream.Collectors;
import com.quantumshop.userservice.dto.UserResponse;

@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserService service;

    public UserController(UserService service) {
        this.service = service;
    }

    @GetMapping
    public List<UserResponse> all() {
        return service.findAll().stream()
                .map(UserResponse::new)
                .collect(Collectors.toList());
    }

    @PostMapping
    public UserResponse create(@RequestBody UserEntity user) {
        return new UserResponse(service.save(user));
    }
}
*/





