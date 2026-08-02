package com.flexserv.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.flexserv.dto.request.AddressRequest;
import com.flexserv.dto.request.UpdateUserRequest;
import com.flexserv.dto.response.AddressResponse;
import com.flexserv.dto.response.UserResponse;
import com.flexserv.payload.ApiResponse;
import com.flexserv.security.CustomUserDetails;
import com.flexserv.service.UserService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
public class UserController {

    private final UserService userService;

    // --- User Profile Endpoints ---

    @GetMapping("/profile")
    public ResponseEntity<ApiResponse<UserResponse>> getProfile(
            @AuthenticationPrincipal CustomUserDetails currentUser) {
        
        UserResponse user = userService.getUserProfile(currentUser.getUserId());
        return ResponseEntity.ok(new ApiResponse<>(true, "Profile fetched successfully", user));
    }

    @PutMapping("/profile")
    public ResponseEntity<ApiResponse<UserResponse>> updateProfile(
            @AuthenticationPrincipal CustomUserDetails currentUser,
            @Valid @RequestBody UpdateUserRequest request) {

        UserResponse updatedUser = userService.updateUserProfile(currentUser.getUserId(), request);
        return ResponseEntity.ok(new ApiResponse<>(true, "Profile updated successfully", updatedUser));
    }

    @DeleteMapping("/profile")
    public ResponseEntity<ApiResponse<String>> deleteAccount(
            @AuthenticationPrincipal CustomUserDetails currentUser) {

        userService.deleteUserAccount(currentUser.getUserId());
        return ResponseEntity.ok(new ApiResponse<>(true, "Account deleted successfully", null));
    }

    // --- Address Endpoints ---

    @PostMapping("/addresses")
    public ResponseEntity<ApiResponse<AddressResponse>> addAddress(
            @AuthenticationPrincipal CustomUserDetails currentUser,
            @Valid @RequestBody AddressRequest request) {

        AddressResponse address = userService.addAddress(currentUser.getUserId(), request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(new ApiResponse<>(true, "Address added successfully", address));
    }

    @GetMapping("/addresses")
    public ResponseEntity<ApiResponse<List<AddressResponse>>> getAddresses(
            @AuthenticationPrincipal CustomUserDetails currentUser) {

        List<AddressResponse> addresses = userService.getUserAddresses(currentUser.getUserId());
        return ResponseEntity.ok(new ApiResponse<>(true, "Addresses fetched successfully", addresses));
    }

    @PutMapping("/addresses/{addressId}")
    public ResponseEntity<ApiResponse<AddressResponse>> updateAddress(
            @AuthenticationPrincipal CustomUserDetails currentUser,
            @PathVariable Long addressId,
            @Valid @RequestBody AddressRequest request) {

        AddressResponse address = userService.updateAddress(currentUser.getUserId(), addressId, request);
        return ResponseEntity.ok(new ApiResponse<>(true, "Address updated successfully", address));
    }

    @DeleteMapping("/addresses/{addressId}")
    public ResponseEntity<ApiResponse<String>> deleteAddress(
            @AuthenticationPrincipal CustomUserDetails currentUser,
            @PathVariable Long addressId) {

        userService.deleteAddress(currentUser.getUserId(), addressId);
        return ResponseEntity.ok(new ApiResponse<>(true, "Address deleted successfully", null));
    }
}