package com.flexserv.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.flexserv.dto.response.AdminResponse;
import com.flexserv.dto.response.BookingResponse;
import com.flexserv.dto.response.CategoryResponse;
import com.flexserv.dto.response.ServiceProviderResponse;
import com.flexserv.dto.response.ServiceResponse;
import com.flexserv.dto.response.UserResponse;
import com.flexserv.entity.Role;
import com.flexserv.payload.ApiResponse;
import com.flexserv.service.AdminService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
public class AdminController {

    private final AdminService adminService;

   

   

    // Admins GET Endpoints
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<AdminResponse>> getAdminById(@PathVariable Long id) {

        AdminResponse admin = adminService.getAdminById(id);

        ApiResponse<AdminResponse> apiResponse = new ApiResponse<>(
                true,
                "Admin Details Retrieved Successfully",
                admin
        );

        return ResponseEntity.ok(apiResponse);
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<AdminResponse>>> getAllAdmins() {

        List<AdminResponse> admins = adminService.getAllAdmins();

        ApiResponse<List<AdminResponse>> apiResponse = new ApiResponse<>(
                true,
                "All Admins Retrieved Successfully",
                admins
        );

        return ResponseEntity.ok(apiResponse);
    }

    // Users GET Endpoints
    @GetMapping("/users")
    public ResponseEntity<ApiResponse<List<UserResponse>>> getAllUsers() {

        List<UserResponse> users = adminService.getAllUsers();

        ApiResponse<List<UserResponse>> apiResponse = new ApiResponse<>(
                true,
                "All Users Retrieved Successfully",
                users
        );

        return ResponseEntity.ok(apiResponse);
    }

    @GetMapping("/users/{id}")
    public ResponseEntity<ApiResponse<UserResponse>> getUserById(@PathVariable Long id) {

        UserResponse user = adminService.getUserById(id);

        ApiResponse<UserResponse> apiResponse = new ApiResponse<>(
                true,
                "User Details Retrieved Successfully",
                user
        );

        return ResponseEntity.ok(apiResponse);
    }

    @GetMapping("/users/role/{role}")
    public ResponseEntity<ApiResponse<List<UserResponse>>> getUsersByRole(@PathVariable Role role) {

        List<UserResponse> users = adminService.getUsersByRole(role);

        ApiResponse<List<UserResponse>> apiResponse = new ApiResponse<>(
                true,
                "Users Retrieved Successfully By Role",
                users
        );

        return ResponseEntity.ok(apiResponse);
    }

    // Service Providers GET Endpoints
    @GetMapping("/providers")
    public ResponseEntity<ApiResponse<List<ServiceProviderResponse>>> getAllProviders() {

        List<ServiceProviderResponse> providers = adminService.getAllProviders();

        ApiResponse<List<ServiceProviderResponse>> apiResponse = new ApiResponse<>(
                true,
                "All Service Providers Retrieved Successfully",
                providers
        );

        return ResponseEntity.ok(apiResponse);
    }

    @GetMapping("/providers/{id}")
    public ResponseEntity<ApiResponse<ServiceProviderResponse>> getProviderById(@PathVariable Long id) {

        ServiceProviderResponse provider = adminService.getProviderById(id);

        ApiResponse<ServiceProviderResponse> apiResponse = new ApiResponse<>(
                true,
                "Service Provider Details Retrieved Successfully",
                provider
        );

        return ResponseEntity.ok(apiResponse);
    }

    // Services GET Endpoints
    @GetMapping("/services")
    public ResponseEntity<ApiResponse<List<ServiceResponse>>> getAllServices() {

        List<ServiceResponse> services = adminService.getAllServices();

        ApiResponse<List<ServiceResponse>> apiResponse = new ApiResponse<>(
                true,
                "All Services Retrieved Successfully",
                services
        );

        return ResponseEntity.ok(apiResponse);
    }

    @GetMapping("/services/{id}")
    public ResponseEntity<ApiResponse<ServiceResponse>> getServiceById(@PathVariable Long id) {

        ServiceResponse service = adminService.getServiceById(id);

        ApiResponse<ServiceResponse> apiResponse = new ApiResponse<>(
                true,
                "Service Details Retrieved Successfully",
                service
        );

        return ResponseEntity.ok(apiResponse);
    }

    // Categories GET Endpoints
    @GetMapping("/categories")
    public ResponseEntity<ApiResponse<List<CategoryResponse>>> getAllCategories() {

        List<CategoryResponse> categories = adminService.getAllCategories();

        ApiResponse<List<CategoryResponse>> apiResponse = new ApiResponse<>(
                true,
                "All Categories Retrieved Successfully",
                categories
        );

        return ResponseEntity.ok(apiResponse);
    }

    @GetMapping("/categories/{id}")
    public ResponseEntity<ApiResponse<CategoryResponse>> getCategoryById(@PathVariable Long id) {

        CategoryResponse category = adminService.getCategoryById(id);

        ApiResponse<CategoryResponse> apiResponse = new ApiResponse<>(
                true,
                "Category Details Retrieved Successfully",
                category
        );

        return ResponseEntity.ok(apiResponse);
    }

    // Bookings GET Endpoints
    @GetMapping("/bookings")
    public ResponseEntity<ApiResponse<List<BookingResponse>>> getAllBookings() {

        List<BookingResponse> bookings = adminService.getAllBookings();

        ApiResponse<List<BookingResponse>> apiResponse = new ApiResponse<>(
                true,
                "All Bookings Retrieved Successfully",
                bookings
        );

        return ResponseEntity.ok(apiResponse);
    }

    @GetMapping("/bookings/{id}")
    public ResponseEntity<ApiResponse<BookingResponse>> getBookingById(@PathVariable Long id) {

        BookingResponse booking = adminService.getBookingById(id);

        ApiResponse<BookingResponse> apiResponse = new ApiResponse<>(
                true,
                "Booking Details Retrieved Successfully",
                booking
        );

        return ResponseEntity.ok(apiResponse);
    }
}
