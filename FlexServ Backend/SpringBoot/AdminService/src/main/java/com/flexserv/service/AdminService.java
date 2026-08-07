package com.flexserv.service;

import java.util.List;

import com.flexserv.dto.request.AdminRegisterRequest;
import com.flexserv.dto.request.UpdateProviderRequest;
import com.flexserv.dto.response.AdminResponse;
import com.flexserv.dto.response.BookingResponse;
import com.flexserv.dto.response.CategoryResponse;
import com.flexserv.dto.response.ServiceProviderResponse;
import com.flexserv.dto.response.ServiceResponse;
import com.flexserv.dto.response.UserResponse;
import com.flexserv.entity.Role;

public interface AdminService {

    

    // Admins
    AdminResponse registerAdmin(AdminRegisterRequest request);
    AdminResponse getAdminById(Long id);
    List<AdminResponse> getAllAdmins();

    // Users
    List<UserResponse> getAllUsers();
    UserResponse getUserById(Long id);
    List<UserResponse> getUsersByRole(Role role);

    // Service Providers
    List<ServiceProviderResponse> getAllProviders();
    ServiceProviderResponse getProviderById(Long id);
    ServiceProviderResponse getProviderByUserId(Long userId);
    ServiceProviderResponse updateProviderAvailability(Long providerId, Boolean available);
    ServiceProviderResponse updateProviderProfile(Long providerId, UpdateProviderRequest request);

    
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
