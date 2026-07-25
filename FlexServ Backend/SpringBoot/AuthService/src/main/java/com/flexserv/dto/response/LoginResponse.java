package com.flexserv.dto.response;

import com.flexserv.entity.Role;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
public class LoginResponse {

    private Long userId;

    private String name;

    private Role role;

    private String message;

}