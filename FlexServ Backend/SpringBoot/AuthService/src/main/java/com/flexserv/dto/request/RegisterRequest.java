package com.flexserv.dto.request;

import com.flexserv.entity.Role;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class RegisterRequest {

	@NotBlank(message = "Name is required")
	@Size(min = 3, max = 100, message = "Name must be between 3 and 100 characters")
	private String name;

	@NotBlank(message = "Email is required")
	@Email(message = "Enter a valid email")
	private String email;

	@NotBlank(message = "Phone number is required")
	@Pattern(regexp = "^[6-9]\\d{9}$", message = "Enter a valid 10-digit Indian mobile number")
	private String phone;

	@NotBlank(message = "Password is required")
	@Size(min = 6, max = 30, message = "Password must be between 6 and 30 characters")
	private String password;
	
	@NotNull(message = "Role is required")
	private Role role;

	private String companyName;

	private Integer experienceYears;

	private String bio;
}