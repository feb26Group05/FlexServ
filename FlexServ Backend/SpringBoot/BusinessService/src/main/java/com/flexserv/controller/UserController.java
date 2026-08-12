package com.flexserv.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.flexserv.dto.request.AddressRequest;
import com.flexserv.dto.request.UpdateUserRequest;
import com.flexserv.dto.response.AddressResponse;
import com.flexserv.dto.response.UserResponse;
import com.flexserv.payload.ApiResponse;
import com.flexserv.service.UserService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    // --- User Profile Endpoints ---

    @GetMapping("/profile")
    public ResponseEntity<ApiResponse<UserResponse>> getProfile(
            @RequestHeader(value = "X-User-Id", required = false) Long userId) {
        
        UserResponse user = userService.getUserProfile(userId);
        return ResponseEntity.ok(new ApiResponse<>(true, "Profile fetched successfully", user));
    }

    @PutMapping("/profile")
    public ResponseEntity<ApiResponse<UserResponse>> updateProfile(
            @RequestHeader(value = "X-User-Id", required = false) Long userId,
            @Valid @RequestBody UpdateUserRequest request) {

        UserResponse updatedUser = userService.updateUserProfile(userId, request);
        return ResponseEntity.ok(new ApiResponse<>(true, "Profile updated successfully", updatedUser));
    }

    @DeleteMapping("/profile")
    public ResponseEntity<ApiResponse<String>> deleteAccount(
            @RequestHeader(value = "X-User-Id", required = false) Long userId) {

        userService.deleteUserAccount(userId);
        return ResponseEntity.ok(new ApiResponse<>(true, "Account deleted successfully", null));
    }

    // --- Address Endpoints ---

    @PostMapping("/addresses")
    public ResponseEntity<ApiResponse<AddressResponse>> addAddress(
            @RequestHeader(value = "X-User-Id", required = false) Long userId,
            @Valid @RequestBody AddressRequest request) {

        AddressResponse address = userService.addAddress(userId, request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(new ApiResponse<>(true, "Address added successfully", address));
    }

    @GetMapping("/addresses")
    public ResponseEntity<ApiResponse<List<AddressResponse>>> getAddresses(
            @RequestHeader(value = "X-User-Id", required = false) Long userId) {

        List<AddressResponse> addresses = userService.getUserAddresses(userId);
        return ResponseEntity.ok(new ApiResponse<>(true, "Addresses fetched successfully", addresses));
    }

    @PutMapping("/addresses/{addressId}")
    public ResponseEntity<ApiResponse<AddressResponse>> updateAddress(
            @RequestHeader(value = "X-User-Id", required = false) Long userId,
            @PathVariable Long addressId,
            @Valid @RequestBody AddressRequest request) {

        AddressResponse address = userService.updateAddress(userId, addressId, request);
        return ResponseEntity.ok(new ApiResponse<>(true, "Address updated successfully", address));
    }

    @DeleteMapping("/addresses/{addressId}")
    public ResponseEntity<ApiResponse<String>> deleteAddress(
            @RequestHeader(value = "X-User-Id", required = false) Long userId,
            @PathVariable Long addressId) {

        userService.deleteAddress(userId, addressId);
        return ResponseEntity.ok(new ApiResponse<>(true, "Address deleted successfully", null));
    }
}