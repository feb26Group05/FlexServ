package com.FlexServ.FlexServ.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.FlexServ.FlexServ.entity.User;
import com.FlexServ.FlexServ.service.AuthService;

import java.util.Map;

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