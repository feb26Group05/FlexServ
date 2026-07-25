package com.flexserv.service;

import com.flexserv.dto.request.LoginRequest;
import com.flexserv.dto.request.RegisterRequest;
import com.flexserv.dto.response.LoginResponse;
import com.flexserv.dto.response.UserResponse;

public interface AuthService 
{
	UserResponse register(RegisterRequest request);

    LoginResponse login(LoginRequest request);

}
