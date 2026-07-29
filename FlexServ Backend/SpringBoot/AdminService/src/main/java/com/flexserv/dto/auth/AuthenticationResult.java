package com.flexserv.dto.auth;

import com.flexserv.dto.response.LoginResponse;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class AuthenticationResult {

    private String token;

    private LoginResponse loginResponse;

}