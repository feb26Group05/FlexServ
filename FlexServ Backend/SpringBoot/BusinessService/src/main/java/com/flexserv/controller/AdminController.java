package com.flexserv.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.flexserv.dto.request.AdminRegisterRequest;
import com.flexserv.dto.request.CategoryRequest;
import com.flexserv.dto.request.UpdateProviderRequest;
import com.flexserv.dto.response.AdminResponse;
import com.flexserv.dto.response.BookingResponse;
import com.flexserv.dto.response.CategoryResponse;
import com.flexserv.dto.response.ServiceProviderResponse;
import com.flexserv.dto.response.ServiceResponse;
import com.flexserv.dto.response.UserResponse;
import com.flexserv.entity.Role;
import com.flexserv.payload.ApiResponse;
import com.flexserv.service.BusinessService;

import org.springframework.web.bind.annotation.DeleteMapping;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
//@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
public class AdminController {

    private final BusinessService businessService;

    // Register Admin POST Endpoint
    @PostMapping("/register")
    public ResponseEntity<ApiResponse<AdminResponse>> registerAdmin(
            @Valid @RequestBody AdminRegisterRequest request) {

        AdminResponse admin = businessService.registerAdmin(request);

        ApiResponse<AdminResponse> apiResponse = new ApiResponse<>(
                true,
                "Admin Registered Successfully",
                admin
        );

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(apiResponse);
    }

    // Admins GET Endpoints
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<AdminResponse>> getAdminById(@PathVariable Long id) {

        AdminResponse admin = businessService.getAdminById(id);

        ApiResponse<AdminResponse> apiResponse = new ApiResponse<>(
                true,
                "Admin Details Retrieved Successfully",
                admin
        );

        return ResponseEntity.ok(apiResponse);
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<AdminResponse>>> getAllAdmins() {

        List<AdminResponse> admins = businessService.getAllAdmins();

        ApiResponse<List<AdminResponse>> apiResponse = new ApiResponse<>(
                true,
                "All Admins Retrieved Successfully",
                admins
        );

        return ResponseEntity.ok(apiResponse);
    }

    // Users GET & PUT Status Endpoints
    @GetMapping("/users")
    public ResponseEntity<ApiResponse<List<UserResponse>>> getAllUsers() {

        List<UserResponse> users = businessService.getAllUsers();

        ApiResponse<List<UserResponse>> apiResponse = new ApiResponse<>(
                true,
                "All Users Retrieved Successfully",
                users
        );

        return ResponseEntity.ok(apiResponse);
    }

    @GetMapping("/users/{id}")
    public ResponseEntity<ApiResponse<UserResponse>> getUserById(@PathVariable Long id) {

        UserResponse user = businessService.getUserById(id);

        ApiResponse<UserResponse> apiResponse = new ApiResponse<>(
                true,
                "User Details Retrieved Successfully",
                user
        );

        return ResponseEntity.ok(apiResponse);
    }

    @GetMapping("/users/role/{role}")
    public ResponseEntity<ApiResponse<List<UserResponse>>> getUsersByRole(@PathVariable Role role) {

        List<UserResponse> users = businessService.getUsersByRole(role);

        ApiResponse<List<UserResponse>> apiResponse = new ApiResponse<>(
                true,
                "Users Retrieved Successfully By Role",
                users
        );

        return ResponseEntity.ok(apiResponse);
    }

    @PutMapping("/users/{id}/status")
    public ResponseEntity<ApiResponse<UserResponse>> updateUserStatus(
            @PathVariable Long id,
            @RequestParam Boolean active) {

        UserResponse user = businessService.updateUserStatus(id, active);

        ApiResponse<UserResponse> apiResponse = new ApiResponse<>(
                true,
                active ? "User Account Activated Successfully" : "User Account Soft-Deleted / Deactivated Successfully",
                user
        );

        return ResponseEntity.ok(apiResponse);
    }

    @PutMapping("/users/{id}/soft-delete")
    public ResponseEntity<ApiResponse<UserResponse>> softDeleteUser(
            @PathVariable Long id,
            @RequestParam(required = false, defaultValue = "false") Boolean active) {

        UserResponse user = businessService.updateUserStatus(id, active);

        ApiResponse<UserResponse> apiResponse = new ApiResponse<>(
                true,
                "User Account Soft Delete Status Updated",
                user
        );

        return ResponseEntity.ok(apiResponse);
    }

    // Service Providers GET & PUT Endpoints
    @GetMapping("/providers")
    public ResponseEntity<ApiResponse<List<ServiceProviderResponse>>> getAllProviders() {

        List<ServiceProviderResponse> providers = businessService.getAllProviders();

        ApiResponse<List<ServiceProviderResponse>> apiResponse = new ApiResponse<>(
                true,
                "All Service Providers Retrieved Successfully",
                providers
        );

        return ResponseEntity.ok(apiResponse);
    }

    @GetMapping("/providers/{id}")
    public ResponseEntity<ApiResponse<ServiceProviderResponse>> getProviderById(@PathVariable Long id) {

        ServiceProviderResponse provider = businessService.getProviderById(id);

        ApiResponse<ServiceProviderResponse> apiResponse = new ApiResponse<>(
                true,
                "Service Provider Details Retrieved Successfully",
                provider
        );

        return ResponseEntity.ok(apiResponse);
    }

    @GetMapping("/providers/user/{userId}")
    public ResponseEntity<ApiResponse<ServiceProviderResponse>> getProviderByUserId(@PathVariable Long userId) {

        ServiceProviderResponse provider = businessService.getProviderByUserId(userId);

        ApiResponse<ServiceProviderResponse> apiResponse = new ApiResponse<>(
                true,
                "Service Provider Details Retrieved By User ID",
                provider
        );

        return ResponseEntity.ok(apiResponse);
    }

    @PutMapping("/providers/{id}/availability")
    public ResponseEntity<ApiResponse<ServiceProviderResponse>> updateProviderAvailability(
            @PathVariable Long id,
            @RequestParam Boolean available) {

        ServiceProviderResponse provider = businessService.updateProviderAvailability(id, available);

        ApiResponse<ServiceProviderResponse> apiResponse = new ApiResponse<>(
                true,
                "Service Provider Availability Updated Successfully",
                provider
        );

        return ResponseEntity.ok(apiResponse);
    }

    @PutMapping("/providers/{id}/status")
    public ResponseEntity<ApiResponse<ServiceProviderResponse>> updateProviderStatus(
            @PathVariable Long id,
            @RequestParam Boolean active) {

        ServiceProviderResponse provider = businessService.updateProviderStatus(id, active);

        ApiResponse<ServiceProviderResponse> apiResponse = new ApiResponse<>(
                true,
                active ? "Service Provider Activated Successfully" : "Service Provider Soft-Deleted / Deactivated Successfully",
                provider
        );

        return ResponseEntity.ok(apiResponse);
    }

    @PutMapping("/providers/{id}/soft-delete")
    public ResponseEntity<ApiResponse<ServiceProviderResponse>> softDeleteProvider(
            @PathVariable Long id,
            @RequestParam(required = false, defaultValue = "false") Boolean active) {

        ServiceProviderResponse provider = businessService.updateProviderStatus(id, active);

        ApiResponse<ServiceProviderResponse> apiResponse = new ApiResponse<>(
                true,
                "Service Provider Soft Delete Status Updated",
                provider
        );

        return ResponseEntity.ok(apiResponse);
    }

    @PutMapping("/providers/{id}")
    public ResponseEntity<ApiResponse<ServiceProviderResponse>> updateProviderProfile(
            @PathVariable Long id,
            @RequestBody UpdateProviderRequest request) {

        ServiceProviderResponse provider = businessService.updateProviderProfile(id, request);

        ApiResponse<ServiceProviderResponse> apiResponse = new ApiResponse<>(
                true,
                "Service Provider Profile and Offered Services Updated Successfully",
                provider
        );

        return ResponseEntity.ok(apiResponse);
    }

    // Services GET, POST & PUT Endpoints
    @GetMapping("/services")
    public ResponseEntity<ApiResponse<List<ServiceResponse>>> getAllServices() {

        List<ServiceResponse> services = businessService.getAllServices();

        ApiResponse<List<ServiceResponse>> apiResponse = new ApiResponse<>(
                true,
                "All Services Retrieved Successfully",
                services
        );

        return ResponseEntity.ok(apiResponse);
    }

    @GetMapping("/services/{id}")
    public ResponseEntity<ApiResponse<ServiceResponse>> getServiceById(@PathVariable Long id) {

        ServiceResponse service = businessService.getServiceById(id);

        ApiResponse<ServiceResponse> apiResponse = new ApiResponse<>(
                true,
                "Service Details Retrieved Successfully",
                service
        );

        return ResponseEntity.ok(apiResponse);
    }

    @PostMapping("/services")
    public ResponseEntity<ApiResponse<ServiceResponse>> createService(
            @Valid @RequestBody com.flexserv.dto.request.ServiceRequest request) {

        ServiceResponse service = businessService.createService(request);

        ApiResponse<ServiceResponse> apiResponse = new ApiResponse<>(
                true,
                "Service Created Successfully",
                service
        );

        return ResponseEntity.status(HttpStatus.CREATED).body(apiResponse);
    }

    @PutMapping("/services/{id}")
    public ResponseEntity<ApiResponse<ServiceResponse>> updateService(
            @PathVariable Long id,
            @RequestBody com.flexserv.dto.request.ServiceRequest request) {

        ServiceResponse service = businessService.updateService(id, request);

        ApiResponse<ServiceResponse> apiResponse = new ApiResponse<>(
                true,
                "Service Updated Successfully",
                service
        );

        return ResponseEntity.ok(apiResponse);
    }

    // Categories GET, POST & DELETE Endpoints
    @GetMapping("/categories")
    public ResponseEntity<ApiResponse<List<CategoryResponse>>> getAllCategories() {

        List<CategoryResponse> categories = businessService.getAllCategories();

        ApiResponse<List<CategoryResponse>> apiResponse = new ApiResponse<>(
                true,
                "All Categories Retrieved Successfully",
                categories
        );

        return ResponseEntity.ok(apiResponse);
    }

    @GetMapping("/categories/{id}")
    public ResponseEntity<ApiResponse<CategoryResponse>> getCategoryById(@PathVariable Long id) {

        CategoryResponse category = businessService.getCategoryById(id);

        ApiResponse<CategoryResponse> apiResponse = new ApiResponse<>(
                true,
                "Category Details Retrieved Successfully",
                category
        );

        return ResponseEntity.ok(apiResponse);
    }

    @PostMapping("/categories")
    public ResponseEntity<ApiResponse<CategoryResponse>> createCategory(
            @Valid @RequestBody CategoryRequest request) {

        CategoryResponse category = businessService.createCategory(request);

        ApiResponse<CategoryResponse> apiResponse = new ApiResponse<>(
                true,
                "Category Created Successfully",
                category
        );

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(apiResponse);
    }

    @DeleteMapping("/categories/{id}")
    public ResponseEntity<ApiResponse<String>> deleteCategory(@PathVariable Long id) {

        businessService.deleteCategory(id);

        ApiResponse<String> apiResponse = new ApiResponse<>(
                true,
                "Category Deleted Successfully",
                "Category with ID " + id + " has been deleted."
        );

        return ResponseEntity.ok(apiResponse);
    }

    // Bookings GET & PUT Endpoints
    @GetMapping("/bookings")
    public ResponseEntity<ApiResponse<List<BookingResponse>>> getAllBookings() {

        List<BookingResponse> bookings = businessService.getAllBookings();

        ApiResponse<List<BookingResponse>> apiResponse = new ApiResponse<>(
                true,
                "All Bookings Retrieved Successfully",
                bookings
        );

        return ResponseEntity.ok(apiResponse);
    }

    @GetMapping("/bookings/{id}")
    public ResponseEntity<ApiResponse<BookingResponse>> getBookingById(@PathVariable Long id) {

        BookingResponse booking = businessService.getBookingById(id);

        ApiResponse<BookingResponse> apiResponse = new ApiResponse<>(
                true,
                "Booking Details Retrieved Successfully",
                booking
        );

        return ResponseEntity.ok(apiResponse);
    }

    @GetMapping("/bookings/provider/{providerId}")
    public ResponseEntity<ApiResponse<List<BookingResponse>>> getBookingsByProviderId(@PathVariable Long providerId) {

        List<BookingResponse> bookings = businessService.getBookingsByProviderId(providerId);

        ApiResponse<List<BookingResponse>> apiResponse = new ApiResponse<>(
                true,
                "Provider Bookings Retrieved Successfully",
                bookings
        );

        return ResponseEntity.ok(apiResponse);
    }

    @PutMapping("/bookings/{id}/status")
    public ResponseEntity<ApiResponse<BookingResponse>> updateBookingStatus(
            @PathVariable Long id,
            @RequestParam String status) {

        BookingResponse booking = businessService.updateBookingStatus(id, status);

        ApiResponse<BookingResponse> apiResponse = new ApiResponse<>(
                true,
                "Booking Status Updated Successfully",
                booking
        );

        return ResponseEntity.ok(apiResponse);
    }
}
