package com.flexserv.service;

import java.util.List;

import com.flexserv.dto.request.AdminRegisterRequest;
import com.flexserv.dto.request.UpdateProviderRequest;
import com.flexserv.dto.request.CategoryRequest;
import com.flexserv.dto.request.ServiceRequest;
import com.flexserv.dto.response.AdminResponse;
import com.flexserv.dto.response.BookingResponse;
import com.flexserv.dto.response.CategoryResponse;
import com.flexserv.dto.response.ServiceProviderResponse;
import com.flexserv.dto.response.ServiceResponse;
import com.flexserv.dto.response.UserResponse;
import com.flexserv.entity.Role;

public interface BusinessService {

    // Admins
    AdminResponse registerAdmin(AdminRegisterRequest request);
    AdminResponse getAdminById(Long id);
    List<AdminResponse> getAllAdmins();

    // Users
    List<UserResponse> getAllUsers();
    UserResponse getUserById(Long id);
    List<UserResponse> getUsersByRole(Role role);
    UserResponse updateUserStatus(Long userId, Boolean active);

    // Service Providers
    List<ServiceProviderResponse> getAllProviders();
    ServiceProviderResponse getProviderById(Long id);
    ServiceProviderResponse getProviderByUserId(Long userId);
    ServiceProviderResponse updateProviderAvailability(Long providerId, Boolean available);
    ServiceProviderResponse updateProviderProfile(Long providerId, UpdateProviderRequest request);
    ServiceProviderResponse updateProviderStatus(Long providerId, Boolean active);

    // Services
    List<ServiceResponse> getAllServices();
    ServiceResponse getServiceById(Long id);
    ServiceResponse createService(ServiceRequest request);
    ServiceResponse updateService(Long id, ServiceRequest request);

    // Categories
    List<CategoryResponse> getAllCategories();
    CategoryResponse getCategoryById(Long id);
    CategoryResponse createCategory(CategoryRequest request);
    void deleteCategory(Long id);

    // Bookings
    List<BookingResponse> getAllBookings();
    BookingResponse getBookingById(Long id);
    List<BookingResponse> getBookingsByProviderId(Long providerId);
    BookingResponse updateBookingStatus(Long bookingId, String status);
}
