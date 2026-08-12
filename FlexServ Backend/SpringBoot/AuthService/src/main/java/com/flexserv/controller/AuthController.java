package com.flexserv.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.flexserv.dto.auth.AuthenticationResult;
import com.flexserv.dto.request.LoginRequest;
import com.flexserv.dto.request.RegisterRequest;
import com.flexserv.dto.response.LoginResponse;
import com.flexserv.dto.response.UserResponse;
import com.flexserv.payload.ApiResponse;
import com.flexserv.service.AuthService;

import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
//@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
public class AuthController {

    private final AuthService authService;

    @PostMapping("/register")
    public ResponseEntity<ApiResponse<UserResponse>> registerUser(
            @Valid @RequestBody RegisterRequest request) {

        UserResponse user = authService.register(request);

        ApiResponse<UserResponse> apiResponse =
                new ApiResponse<>(
                        true,
                        "User Registered Successfully",
                        user
                );

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(apiResponse);
    }

    @PostMapping("/login")
    public ResponseEntity<ApiResponse<LoginResponse>> loginUser(
            @Valid @RequestBody LoginRequest request,
            HttpServletResponse response) {

        AuthenticationResult authResult = authService.login(request);

        Cookie cookie = new Cookie("JWT", authResult.getToken());

        cookie.setHttpOnly(true);
        cookie.setSecure(false);          
        cookie.setPath("/");
        cookie.setMaxAge(15 * 60);

        response.addCookie(cookie);

        ApiResponse<LoginResponse> apiResponse =
                new ApiResponse<>(
                        true,
                        "Login Successful",
                        authResult.getLoginResponse()
                );

        return ResponseEntity.ok(apiResponse);
    }

    @PostMapping("/logout")
    public ResponseEntity<ApiResponse<String>> logoutUser(HttpServletResponse response) {
        Cookie cookie = new Cookie("JWT", null);
        cookie.setHttpOnly(true);
        cookie.setSecure(false);
        cookie.setPath("/");
        cookie.setMaxAge(0);

        response.addCookie(cookie);

        ApiResponse<String> apiResponse = new ApiResponse<>(
                true,
                "Logout Successful",
                "Logged out successfully"
        );

        return ResponseEntity.ok(apiResponse);
    }

}