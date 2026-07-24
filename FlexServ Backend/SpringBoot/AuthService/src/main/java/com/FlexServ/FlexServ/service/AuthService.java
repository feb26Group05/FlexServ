package com.FlexServ.FlexServ.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.FlexServ.FlexServ.entity.User;
import com.FlexServ.FlexServ.repository.UserRepository;

@Service
public class AuthService {

    @Autowired
    private UserRepository userRepository;

    public User register(User user) {

        if (userRepository.existsByEmail(user.getEmail())) {
            throw new RuntimeException("Email already exists");
        }

        if (userRepository.existsByPhone(user.getPhone())) {
            throw new RuntimeException("Phone number already exists");
        }

        return userRepository.save(user);
    }
}