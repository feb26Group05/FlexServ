package com.flexserv.service;

import com.flexserv.dto.auth.AuthenticationResult;
import com.flexserv.dto.request.LoginRequest;
import com.flexserv.dto.request.RegisterRequest;
import com.flexserv.dto.response.UserResponse;

public interface AuthService {

    UserResponse register(RegisterRequest request);

    AuthenticationResult login(LoginRequest request);
}