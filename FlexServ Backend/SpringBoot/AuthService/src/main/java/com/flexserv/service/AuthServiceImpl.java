package com.flexserv.service;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.flexserv.dto.auth.AuthenticationResult;
import com.flexserv.dto.request.LoginRequest;
import com.flexserv.dto.request.RegisterRequest;
import com.flexserv.dto.response.LoginResponse;
import com.flexserv.dto.response.UserResponse;
import com.flexserv.entity.Role;
import com.flexserv.entity.User;
import com.flexserv.exception.InvalidCredentialsException;
import com.flexserv.exception.UserAlreadyExistsException;
import com.flexserv.repository.UserRepository;
import com.flexserv.security.JwtService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {

	private final UserRepository userRepository;
	private final PasswordEncoder passwordEncoder;
	private final JwtService jwtService;

	@Override
	public UserResponse register(RegisterRequest request) {

		if (userRepository.existsByEmail(request.getEmail())) {
			throw new UserAlreadyExistsException("Email already exists");
		}

		if (userRepository.existsByPhone(request.getPhone())) {
			throw new UserAlreadyExistsException("Phone number already exists");
		}

		User user = new User();

		user.setName(request.getName());
		user.setEmail(request.getEmail());
		user.setPhone(request.getPhone());

		user.setPassword(passwordEncoder.encode(request.getPassword()));

		Role role = request.getRole();

	    if (role == null) {
	        role = Role.CUSTOMER;
	    }
	    user.setRole(role); 
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
	public AuthenticationResult login(LoginRequest request) {

	    User user = userRepository.findByEmail(request.getEmail())
	            .orElseThrow(() ->
	                    new InvalidCredentialsException("Invalid email or password"));

	    if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
	        throw new InvalidCredentialsException("Invalid email or password");
	    }

	    String token = jwtService.generateToken(user);

	    LoginResponse loginResponse = new LoginResponse(
	            user.getId(),
	            user.getName(),
	            user.getRole()
	    );

	    return new AuthenticationResult(token, loginResponse);
	}
}