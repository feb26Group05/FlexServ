package com.flexserv.controller;

import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.flexserv.entity.User;
import com.flexserv.service.AuthService;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:5173")
public class AuthController {

    @Autowired
    private AuthService authService;

   @PostMapping("/register")
public ResponseEntity<?> register(@RequestBody User user) {

    try {

        User savedUser = authService.register(user);

        return ResponseEntity.ok(
                Map.of(
                        "message", "Registration Successful",
                        "user", savedUser
                )
        );

    } catch (RuntimeException e) {

        return ResponseEntity.status(HttpStatus.CONFLICT)
                .body(
                        Map.of("message", e.getMessage())
                );
    }
}
}