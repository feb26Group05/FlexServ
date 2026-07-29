package com.flexserv.service;

import java.util.List;

import com.flexserv.dto.auth.AuthenticationResult;
import com.flexserv.dto.request.AdminRegisterRequest;
import com.flexserv.dto.request.LoginRequest;
import com.flexserv.dto.response.AdminResponse;
import com.flexserv.dto.response.BookingResponse;
import com.flexserv.dto.response.CategoryResponse;
import com.flexserv.dto.response.ServiceProviderResponse;
import com.flexserv.dto.response.ServiceResponse;
import com.flexserv.dto.response.UserResponse;
import com.flexserv.entity.Role;

public interface AdminService {

    AdminResponse registerAdmin(AdminRegisterRequest request);

    AuthenticationResult loginAdmin(LoginRequest request);

    // Admins
    AdminResponse getAdminById(Long id);
    List<AdminResponse> getAllAdmins();

    // Users
    List<UserResponse> getAllUsers();
    UserResponse getUserById(Long id);
    List<UserResponse> getUsersByRole(Role role);

    // Service Providers
    List<ServiceProviderResponse> getAllProviders();
    ServiceProviderResponse getProviderById(Long id);

    // Services
    List<ServiceResponse> getAllServices();
    ServiceResponse getServiceById(Long id);

    // Categories
    List<CategoryResponse> getAllCategories();
    CategoryResponse getCategoryById(Long id);

    // Bookings
    List<BookingResponse> getAllBookings();
    BookingResponse getBookingById(Long id);
}
