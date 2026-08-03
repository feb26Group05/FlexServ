package com.flexserv.service;

import java.util.List;
import com.flexserv.dto.request.AddressRequest;
import com.flexserv.dto.request.UpdateUserRequest;
import com.flexserv.dto.response.AddressResponse;
import com.flexserv.dto.response.UserResponse;

public interface UserService {

    // User Profile CRUD
    UserResponse getUserProfile(Long userId);
    UserResponse updateUserProfile(Long userId, UpdateUserRequest request);
    void deleteUserAccount(Long userId);

    // Address CRUD
    AddressResponse addAddress(Long userId, AddressRequest request);
    List<AddressResponse> getUserAddresses(Long userId);
    AddressResponse updateAddress(Long userId, Long addressId, AddressRequest request);
    void deleteAddress(Long userId, Long addressId);
}