package com.flexserv.dto.response;

import com.flexserv.entity.Role;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class LoginResponse {

    private Long userId;

    private String name;

    private Role role;

    private String token;

    public LoginResponse(Long userId, String name, Role role) {
        this.userId = userId;
        this.name = name;
        this.role = role;
    }
}