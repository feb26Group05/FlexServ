package com.flexserv.service;

import org.springframework.stereotype.Service;

import com.flexserv.dto.request.LoginRequest;
import com.flexserv.dto.request.RegisterRequest;
import com.flexserv.dto.response.LoginResponse;
import com.flexserv.dto.response.UserResponse;
import com.flexserv.entity.User;
import com.flexserv.entity.Role;
import com.flexserv.repository.UserRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {

    private final UserRepository userRepository;

    @Override
    public UserResponse register(RegisterRequest request) {

        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email already exists");
        }

        if (userRepository.existsByPhone(request.getPhone())) {
            throw new RuntimeException("Phone number already exists");
        }

        User user = new User();

        user.setName(request.getName());
        user.setEmail(request.getEmail());
        user.setPhone(request.getPhone());

        // Password will be encrypted later using BCrypt
        user.setPassword(request.getPassword());

        // Every new registration is a CUSTOMER
        user.setRole(Role.CUSTOMER);

     

        User savedUser = userRepository.save(user);

        UserResponse response = new UserResponse();

        response.setId(savedUser.getId());
        response.setName(savedUser.getName());
        response.setEmail(savedUser.getEmail());
        response.setPhone(savedUser.getPhone());
        response.setRole(savedUser.getRole());
       
        response.setCreatedAt(savedUser.getCreatedAt());

        return response;
    }

    @Override
    public LoginResponse login(LoginRequest request) {

        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("Invalid email or password"));

        // BCrypt password verification will be added later
        if (!user.getPassword().equals(request.getPassword())) {
            throw new RuntimeException("Invalid email or password");
        }

        return new LoginResponse(
                user.getId(),
                user.getName(),
                user.getRole(),
                "Login Successful"
        );
    }
}