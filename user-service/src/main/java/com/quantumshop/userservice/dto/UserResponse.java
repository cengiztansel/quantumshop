package com.quantumshop.userservice.dto;
import com.quantumshop.userservice.model.UserEntity;

public class UserResponse {            //  şifre hash'i asla dışarı sızmasın diye 
    private Long id;
    private String username;
    private String email;
    private String role;

    public UserResponse(UserEntity entity) {
        this.id = entity.getId();
        this.username = entity.getUsername();
        this.email = entity.getEmail();
        this.role = entity.getRole();
    }

    public Long getId() { return id; }
    public String getUsername() { return username; }
    public String getEmail() { return email; }
    public String getRole() { return role; }
}
