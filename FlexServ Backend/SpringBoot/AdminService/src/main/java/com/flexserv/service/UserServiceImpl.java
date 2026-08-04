package com.flexserv.service;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.flexserv.dto.request.AddressRequest;
import com.flexserv.dto.request.UpdateUserRequest;
import com.flexserv.dto.response.AddressResponse;
import com.flexserv.dto.response.UserResponse;
import com.flexserv.entity.Address;
import com.flexserv.entity.User;
import com.flexserv.exception.ResourceNotFoundException;
import com.flexserv.exception.UserAlreadyExistsException;
import com.flexserv.repository.AddressRepository;
import com.flexserv.repository.UserRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final AddressRepository addressRepository;

    @Override
    public UserResponse getUserProfile(Long userId) {
        User user = findUserById(userId);
        return mapToUserResponse(user);
    }

    @Override
    @Transactional
    public UserResponse updateUserProfile(Long userId, UpdateUserRequest request) {
        User user = findUserById(userId);

        // If phone is changed, check for uniqueness
        if (!user.getPhone().equals(request.getPhone()) && userRepository.existsByPhone(request.getPhone())) {
            throw new UserAlreadyExistsException("Phone number already in use by another account");
        }

        user.setName(request.getName());
        user.setPhone(request.getPhone());

        User updatedUser = userRepository.save(user);
        return mapToUserResponse(updatedUser);
    }

    @Override
    @Transactional
    public void deleteUserAccount(Long userId) {
        User user = findUserById(userId);
        userRepository.delete(user);
    }

    // --- Address CRUD Operations ---

    @Override
    @Transactional
    public AddressResponse addAddress(Long userId, AddressRequest request) {
        User user = findUserById(userId);

        Address address = new Address();
        address.setHouseNo(request.getHouseNo());
        address.setStreet(request.getStreet());
        address.setArea(request.getArea());
        address.setCity(request.getCity());
        address.setState(request.getState());
        address.setPincode(request.getPincode());

        user.addAddress(address); // Maintains bidirectional JPA relation
        Address savedAddress = addressRepository.save(address);

        return mapToAddressResponse(savedAddress);
    }

    @Override
    public List<AddressResponse> getUserAddresses(Long userId) {
        findUserById(userId); // Validates user existence
        List<Address> addresses = addressRepository.findByUserId(userId);
        return addresses.stream()
                .map(this::mapToAddressResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public AddressResponse updateAddress(Long userId, Long addressId, AddressRequest request) {
        Address address = addressRepository.findByIdAndUserId(addressId, userId)
                .orElseThrow(() -> new ResourceNotFoundException("Address not found or doesn't belong to this user"));

        address.setHouseNo(request.getHouseNo());
        address.setStreet(request.getStreet());
        address.setArea(request.getArea());
        address.setCity(request.getCity());
        address.setState(request.getState());
        address.setPincode(request.getPincode());

        Address updatedAddress = addressRepository.save(address);
        return mapToAddressResponse(updatedAddress);
    }

    @Override
    @Transactional
    public void deleteAddress(Long userId, Long addressId) {
        User user = findUserById(userId);
        Address address = addressRepository.findByIdAndUserId(addressId, userId)
                .orElseThrow(() -> new ResourceNotFoundException("Address not found or doesn't belong to user"));

        user.removeAddress(address);
        addressRepository.delete(address);
    }

    // --- Helper Mapping Methods ---

    private User findUserById(Long userId) {
        return userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));
    }

    private UserResponse mapToUserResponse(User user) {
        UserResponse response = new UserResponse();
        response.setId(user.getId());
        response.setName(user.getName());
        response.setEmail(user.getEmail());
        response.setPhone(user.getPhone());
        response.setRole(user.getRole());
        response.setActive(user.getIsActive());
        response.setCreatedAt(user.getCreatedAt());
        return response;
    }

    private AddressResponse mapToAddressResponse(Address address) {
        return new AddressResponse(
                address.getId(),
                address.getHouseNo(),
                address.getStreet(),
                address.getArea(),
                address.getCity(),
                address.getState(),
                address.getPincode()
        );
    }
}