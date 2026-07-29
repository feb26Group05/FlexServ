package com.flexserv.service;

import java.util.List;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.flexserv.dto.auth.AuthenticationResult;
import com.flexserv.dto.request.AdminRegisterRequest;
import com.flexserv.dto.request.LoginRequest;
import com.flexserv.dto.response.AdminResponse;
import com.flexserv.dto.response.BookingResponse;
import com.flexserv.dto.response.CategoryResponse;
import com.flexserv.dto.response.LoginResponse;
import com.flexserv.dto.response.ServiceProviderResponse;
import com.flexserv.dto.response.ServiceResponse;
import com.flexserv.dto.response.UserResponse;
import com.flexserv.entity.Admin;
import com.flexserv.entity.Booking;
import com.flexserv.entity.Category;
import com.flexserv.entity.Role;
import com.flexserv.entity.ServiceProvider;
import com.flexserv.entity.User;
import com.flexserv.exception.InvalidCredentialsException;
import com.flexserv.exception.ResourceNotFoundException;
import com.flexserv.exception.UserAlreadyExistsException;
import com.flexserv.repository.AdminRepository;
import com.flexserv.repository.BookingRepository;
import com.flexserv.repository.CategoryRepository;
import com.flexserv.repository.ServiceProviderRepository;
import com.flexserv.repository.ServiceRepository;
import com.flexserv.repository.UserRepository;
import com.flexserv.security.JwtService;

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
    private final JwtService jwtService;

    @Override
    public AdminResponse registerAdmin(AdminRegisterRequest request) {

        if (adminRepository.existsByEmail(request.getEmail())) {
            throw new UserAlreadyExistsException("Admin email already exists");
        }

        if (adminRepository.existsByPhone(request.getPhone())) {
            throw new UserAlreadyExistsException("Admin phone number already exists");
        }

        Admin admin = new Admin();
        admin.setName(request.getName());
        admin.setEmail(request.getEmail());
        admin.setPhone(request.getPhone());
        admin.setPassword(passwordEncoder.encode(request.getPassword()));
        admin.setRole(Role.ADMIN);
        if (request.getDepartment() != null && !request.getDepartment().isBlank()) {
            admin.setDepartment(request.getDepartment());
        } else {
            admin.setDepartment("System Administration");
        }

        Admin savedAdmin = adminRepository.save(admin);

        return mapToResponse(savedAdmin);
    }

    @Override
    public AuthenticationResult loginAdmin(LoginRequest request) {

        Admin admin = adminRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new InvalidCredentialsException("Invalid email or password"));

        if (!passwordEncoder.matches(request.getPassword(), admin.getPassword())) {
            throw new InvalidCredentialsException("Invalid email or password");
        }

        String token = jwtService.generateToken(admin);

        LoginResponse loginResponse = new LoginResponse(
                admin.getId(),
                admin.getName(),
                admin.getRole()
        );

        return new AuthenticationResult(token, loginResponse);
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

    // Status Toggles
    @Override
    public AdminResponse toggleAdminStatus(Long id) {
        Admin admin = adminRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Admin not found with ID: " + id));
        admin.setIsActive(!Boolean.TRUE.equals(admin.getIsActive()));
        Admin updated = adminRepository.save(admin);
        return mapToResponse(updated);
    }

    @Override
    public UserResponse toggleUserStatus(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with ID: " + id));
        user.setIsActive(!Boolean.TRUE.equals(user.getIsActive()));
        User updated = userRepository.save(user);
        return mapUserToResponse(updated);
    }

    @Override
    public ServiceProviderResponse toggleProviderStatus(Long id) {
        ServiceProvider provider = serviceProviderRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Service Provider not found with ID: " + id));
        provider.setIsActive(!Boolean.TRUE.equals(provider.getIsActive()));
        ServiceProvider updated = serviceProviderRepository.save(provider);
        return mapProviderToResponse(updated);
    }

    @Override
    public ServiceResponse toggleServiceStatus(Long id) {
        com.flexserv.entity.Service service = serviceRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Service not found with ID: " + id));
        service.setIsActive(!Boolean.TRUE.equals(service.getIsActive()));
        com.flexserv.entity.Service updated = serviceRepository.save(service);
        return mapServiceToResponse(updated);
    }

    @Override
    public CategoryResponse toggleCategoryStatus(Long id) {
        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Category not found with ID: " + id));
        category.setIsActive(!Boolean.TRUE.equals(category.getIsActive()));
        Category updated = categoryRepository.save(category);
        return mapCategoryToResponse(updated);
    }

    @Override
    public BookingResponse toggleBookingStatus(Long id) {
        Booking booking = bookingRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found with ID: " + id));
        booking.setIsActive(!Boolean.TRUE.equals(booking.getIsActive()));
        Booking updated = bookingRepository.save(booking);
        return mapBookingToResponse(updated);
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
                admin.getIsActive(),
                admin.getCreatedAt()
        );
    }

    private UserResponse mapUserToResponse(User user) {
        return new UserResponse(
                user.getId(),
                user.getName(),
                user.getEmail(),
                user.getPhone(),
                user.getRole(),
                user.getIsActive(),
                user.getCreatedAt()
        );
    }

    private ServiceProviderResponse mapProviderToResponse(ServiceProvider provider) {
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
                provider.getIsActive()
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
                service.getDuration(),
                service.getIsActive()
        );
    }

    private CategoryResponse mapCategoryToResponse(Category category) {
        return new CategoryResponse(
                category.getId(),
                category.getName(),
                category.getDescription(),
                category.getIsActive()
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
                booking.getIsActive(),
                booking.getCreatedAt()
        );
    }
}
