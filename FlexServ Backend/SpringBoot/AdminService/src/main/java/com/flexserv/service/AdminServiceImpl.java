package com.flexserv.service;

import java.util.List;
import java.util.Set;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.flexserv.dto.request.AdminRegisterRequest;
import com.flexserv.dto.request.UpdateProviderRequest;
import com.flexserv.dto.response.AdminResponse;
import com.flexserv.dto.response.BookingResponse;
import com.flexserv.dto.response.CategoryResponse;
import com.flexserv.dto.response.ServiceProviderResponse;
import com.flexserv.dto.response.ServiceResponse;
import com.flexserv.dto.response.UserResponse;
import com.flexserv.entity.Admin;
import com.flexserv.entity.Booking;
import com.flexserv.entity.Category;
import com.flexserv.entity.Role;
import com.flexserv.entity.ServiceProvider;
import com.flexserv.entity.User;
import com.flexserv.exception.ResourceNotFoundException;
import com.flexserv.exception.UserAlreadyExistsException;
import com.flexserv.repository.AdminRepository;
import com.flexserv.repository.BookingRepository;
import com.flexserv.repository.CategoryRepository;
import com.flexserv.repository.ServiceProviderRepository;
import com.flexserv.repository.ServiceRepository;
import com.flexserv.repository.UserRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AdminServiceImpl implements AdminService {

    private final AdminRepository adminRepository;
    private final UserRepository userRepository;
    private final ServiceProviderRepository serviceProviderRepository;
    private final ServiceRepository serviceRepository;
    private final CategoryRepository categoryRepository;
    private final BookingRepository bookingRepository;
    private final PasswordEncoder passwordEncoder;


    // Register Admin
    @Override
    @Transactional
    public AdminResponse registerAdmin(AdminRegisterRequest request) {
        if (adminRepository.existsByEmail(request.getEmail()) || userRepository.existsByEmail(request.getEmail())) {
            throw new UserAlreadyExistsException("Email already registered");
        }

        String encodedPassword = passwordEncoder.encode(request.getPassword());

        Admin admin = new Admin();
        admin.setName(request.getName());
        admin.setEmail(request.getEmail());
        admin.setPhone(request.getPhone());
        admin.setPassword(encodedPassword);
        admin.setRole(Role.ADMIN);
        admin.setDepartment(request.getDepartment() != null && !request.getDepartment().isBlank() 
            ? request.getDepartment() : "System Administration");

        Admin savedAdmin = adminRepository.save(admin);

        // Synchronize with User entity so admin can also authenticate via AuthService login
        User user = new User();
        user.setName(request.getName());
        user.setEmail(request.getEmail());
        user.setPhone(request.getPhone());
        user.setPassword(encodedPassword);
        user.setRole(Role.ADMIN);
        userRepository.save(user);

        return mapToResponse(savedAdmin);
    }
    
    // Admins
    @Override
    public AdminResponse getAdminById(Long id) {
        Admin admin = adminRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Admin not found with ID: " + id));

        return mapToResponse(admin);
    }

    @Override
    public List<AdminResponse> getAllAdmins() {
        return adminRepository.findAll()
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    // Users
    @Override
    public List<UserResponse> getAllUsers() {
        return userRepository.findAll()
                .stream()
                .map(this::mapUserToResponse)
                .toList();
    }

    @Override
    public UserResponse getUserById(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with ID: " + id));

        return mapUserToResponse(user);
    }

    @Override
    public List<UserResponse> getUsersByRole(Role role) {
        return userRepository.findAll()
                .stream()
                .filter(user -> user.getRole() == role)
                .map(this::mapUserToResponse)
                .toList();
    }

    // Service Providers
    @Override
    public List<ServiceProviderResponse> getAllProviders() {
        return serviceProviderRepository.findAll()
                .stream()
                .map(this::mapProviderToResponse)
                .toList();
    }

    @Override
    public ServiceProviderResponse getProviderById(Long id) {
        ServiceProvider provider = serviceProviderRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Service Provider not found with ID: " + id));

        return mapProviderToResponse(provider);
    }
    
    @Override
    public ServiceProviderResponse getProviderByUserId(Long userId) {
        ServiceProvider provider = serviceProviderRepository.findByUserId(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Service Provider profile not found for User ID: " + userId));

        return mapProviderToResponse(provider);
    }

    @Override
    @Transactional
    public ServiceProviderResponse updateProviderAvailability(Long providerId, Boolean available) {
        ServiceProvider provider = serviceProviderRepository.findById(providerId)
                .orElseThrow(() -> new ResourceNotFoundException("Service Provider not found with ID: " + providerId));

        provider.setCompanyAvailable(available);
        ServiceProvider updated = serviceProviderRepository.save(provider);
        return mapProviderToResponse(updated);
    }
    
    @Override
    @Transactional
    public ServiceProviderResponse updateProviderProfile(Long providerId, UpdateProviderRequest request) {
        ServiceProvider provider = serviceProviderRepository.findById(providerId)
                .orElseThrow(() -> new ResourceNotFoundException("Service Provider not found with ID: " + providerId));

        User user = provider.getUser();
        if (user != null) {
            if (request.getUserName() != null && !request.getUserName().isBlank()) {
                user.setName(request.getUserName().trim());
            }
            if (request.getUserPhone() != null && !request.getUserPhone().isBlank()) {
                user.setPhone(request.getUserPhone().trim());
            }
            // Email is explicitly NOT updated as per requirements
            userRepository.save(user);
        }

        if (request.getCompanyName() != null && !request.getCompanyName().isBlank()) {
            provider.setCompanyName(request.getCompanyName().trim());
        }
        if (request.getExperienceYears() != null) {
            provider.setExperienceYears(request.getExperienceYears());
        }
        if (request.getBio() != null) {
            provider.setBio(request.getBio().trim());
        }

        if (request.getServiceIds() != null) {
            Set<com.flexserv.entity.Service> updatedServices = new java.util.HashSet<>(
                serviceRepository.findAllById(request.getServiceIds())
            );
            provider.setServices(updatedServices);
        }

        ServiceProvider updated = serviceProviderRepository.save(provider);
        return mapProviderToResponse(updated);
    }

    // Services
    @Override
    public List<ServiceResponse> getAllServices() {
        return serviceRepository.findAll()
                .stream()
                .map(this::mapServiceToResponse)
                .toList();
    }

    @Override
    public ServiceResponse getServiceById(Long id) {
        com.flexserv.entity.Service service = serviceRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Service not found with ID: " + id));

        return mapServiceToResponse(service);
    }

    // Categories
    @Override
    public List<CategoryResponse> getAllCategories() {
        return categoryRepository.findAll()
                .stream()
                .map(this::mapCategoryToResponse)
                .toList();
    }

    @Override
    public CategoryResponse getCategoryById(Long id) {
        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Category not found with ID: " + id));

        return mapCategoryToResponse(category);
    }

    // Bookings
    @Override
    public List<BookingResponse> getAllBookings() {
        return bookingRepository.findAll()
                .stream()
                .map(this::mapBookingToResponse)
                .toList();
    }

    @Override
    public BookingResponse getBookingById(Long id) {
        Booking booking = bookingRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found with ID: " + id));

        return mapBookingToResponse(booking);
    }

    // Mapper Helpers
    private AdminResponse mapToResponse(Admin admin) {
        return new AdminResponse(
                admin.getId(),
                admin.getName(),
                admin.getEmail(),
                admin.getPhone(),
                admin.getRole(),
                admin.getDepartment(),
                admin.getCreatedAt()
        );
    }

    private UserResponse mapUserToResponse(User user) {
        UserResponse response = new UserResponse();
        response.setId(user.getId());
        response.setName(user.getName());
        response.setEmail(user.getEmail());
        response.setPhone(user.getPhone());
        response.setRole(user.getRole());
        response.setActive(true);
        response.setCreatedAt(user.getCreatedAt());
        return response;
    }

    private ServiceProviderResponse mapProviderToResponse(ServiceProvider provider) {
        List<Long> serviceIds = provider.getServices() != null
                ? provider.getServices().stream().map(com.flexserv.entity.Service::getId).toList()
                : List.of();
        List<String> serviceNames = provider.getServices() != null
                ? provider.getServices().stream().map(com.flexserv.entity.Service::getName).toList()
                : List.of();

        return new ServiceProviderResponse(
                provider.getId(),
                provider.getUser() != null ? provider.getUser().getId() : null,
                provider.getUser() != null ? provider.getUser().getName() : null,
                provider.getUser() != null ? provider.getUser().getEmail() : null,
                provider.getUser() != null ? provider.getUser().getPhone() : null,
                provider.getCompanyName(),
                provider.getExperienceYears(),
                provider.getBio(),
                provider.getIsVerified(),
                provider.getRating(),
                provider.getCompanyAvailable(),
                serviceIds,
                serviceNames
        );
    }

    private ServiceResponse mapServiceToResponse(com.flexserv.entity.Service service) {
        return new ServiceResponse(
                service.getId(),
                service.getCategory() != null ? service.getCategory().getId() : null,
                service.getCategory() != null ? service.getCategory().getName() : null,
                service.getName(),
                service.getDescription(),
                service.getPrice(),
                service.getDuration()
        );
    }

    private CategoryResponse mapCategoryToResponse(Category category) {
        return new CategoryResponse(
                category.getId(),
                category.getName(),
                category.getDescription()
        );
    }

    private BookingResponse mapBookingToResponse(Booking booking) {
        return new BookingResponse(
                booking.getId(),
                booking.getCustomer() != null ? booking.getCustomer().getId() : null,
                booking.getCustomer() != null ? booking.getCustomer().getName() : null,
                booking.getCustomer() != null ? booking.getCustomer().getEmail() : null,
                booking.getProvider() != null ? booking.getProvider().getId() : null,
                booking.getProvider() != null ? booking.getProvider().getCompanyName() : null,
                booking.getService() != null ? booking.getService().getId() : null,
                booking.getService() != null ? booking.getService().getName() : null,
                booking.getBookingDate(),
                booking.getBookingTime(),
                booking.getStatus(),
                booking.getTotalPrice(),
                booking.getCreatedAt()
        );
    }

	
}
