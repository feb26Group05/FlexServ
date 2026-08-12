using AdminService.Data;
using AdminService.Dtos;
using AdminService.Models;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using ServiceProvider = AdminService.Models.ServiceProvider;

namespace AdminService.Services
{
    public class AdminServiceImpl : IAdminService
    {
        private readonly AdminDbContext _dbContext;

        public AdminServiceImpl(AdminDbContext dbContext)
        {
            _dbContext = dbContext;
        }

        public AdminResponse RegisterAdmin(AdminRegisterRequest request)
        {
            if (_dbContext.Admins.Any(a => a.Email == request.Email) || _dbContext.Users.Any(u => u.Email == request.Email))
            {
                throw new InvalidOperationException("Email already registered");
            }

            var hashedPassword = BCrypt.Net.BCrypt.HashPassword(request.Password);

            var admin = new Admin
            {
                Name = request.Name,
                Email = request.Email,
                Phone = request.Phone,
                Password = hashedPassword,
                Role = Role.ADMIN,
                Department = !string.IsNullOrWhiteSpace(request.Department) ? request.Department : "System Administration",
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            };

            _dbContext.Admins.Add(admin);

            // Synchronize with User entity so admin can also authenticate via AuthService login
            var user = new User
            {
                Name = request.Name,
                Email = request.Email,
                Phone = request.Phone,
                Password = hashedPassword,
                Role = Role.ADMIN,
                IsActive = true,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            };

            _dbContext.Users.Add(user);
            _dbContext.SaveChanges();

            return MapToAdminResponse(admin);
        }

        public AdminResponse GetAdminById(long id)
        {
            var admin = _dbContext.Admins.FirstOrDefault(a => a.Id == id)
                ?? throw new KeyNotFoundException($"Admin not found with ID: {id}");

            return MapToAdminResponse(admin);
        }

        public List<AdminResponse> GetAllAdmins()
        {
            return _dbContext.Admins.Select(a => MapToAdminResponse(a)).ToList();
        }

        public List<UserResponse> GetAllUsers()
        {
            return _dbContext.Users.Select(u => MapToUserResponse(u)).ToList();
        }

        public UserResponse GetUserById(long id)
        {
            var user = _dbContext.Users.FirstOrDefault(u => u.Id == id)
                ?? throw new KeyNotFoundException($"User not found with ID: {id}");

            return MapToUserResponse(user);
        }

        public List<UserResponse> GetUsersByRole(Role role)
        {
            return _dbContext.Users.Where(u => u.Role == role).Select(u => MapToUserResponse(u)).ToList();
        }

        public List<ServiceProviderResponse> GetAllProviders()
        {
            return _dbContext.ServiceProviders
                .Include(p => p.User)
                .Include(p => p.Services)
                .Select(p => MapToProviderResponse(p))
                .ToList();
        }

        public ServiceProviderResponse GetProviderById(long id)
        {
            var provider = _dbContext.ServiceProviders
                .Include(p => p.User)
                .Include(p => p.Services)
                .FirstOrDefault(p => p.Id == id)
                ?? throw new KeyNotFoundException($"Service Provider not found with ID: {id}");

            return MapToProviderResponse(provider);
        }

        public ServiceProviderResponse GetProviderByUserId(long userId)
        {
            var provider = _dbContext.ServiceProviders
                .Include(p => p.User)
                .Include(p => p.Services)
                .FirstOrDefault(p => p.UserId == userId)
                ?? throw new KeyNotFoundException($"Service Provider profile not found for User ID: {userId}");

            return MapToProviderResponse(provider);
        }

        public ServiceProviderResponse UpdateProviderAvailability(long providerId, bool available)
        {
            var provider = _dbContext.ServiceProviders
                .Include(p => p.User)
                .Include(p => p.Services)
                .FirstOrDefault(p => p.Id == providerId)
                ?? throw new KeyNotFoundException($"Service Provider not found with ID: {providerId}");

            provider.CompanyAvailable = available;
            _dbContext.SaveChanges();

            return MapToProviderResponse(provider);
        }

        public ServiceProviderResponse UpdateProviderProfile(long providerId, UpdateProviderRequest request)
        {
            var provider = _dbContext.ServiceProviders
                .Include(p => p.User)
                .Include(p => p.Services)
                .FirstOrDefault(p => p.Id == providerId)
                ?? throw new KeyNotFoundException($"Service Provider not found with ID: {providerId}");

            if (provider.User != null)
            {
                if (!string.IsNullOrWhiteSpace(request.UserName))
                {
                    provider.User.Name = request.UserName.Trim();
                }
                if (!string.IsNullOrWhiteSpace(request.UserPhone))
                {
                    provider.User.Phone = request.UserPhone.Trim();
                }
            }

            if (!string.IsNullOrWhiteSpace(request.CompanyName))
            {
                provider.CompanyName = request.CompanyName.Trim();
            }
            if (request.ExperienceYears.HasValue)
            {
                provider.ExperienceYears = request.ExperienceYears.Value;
            }
            if (request.Bio != null)
            {
                provider.Bio = request.Bio.Trim();
            }

            if (request.ServiceIds != null)
            {
                var targetServices = _dbContext.Services
                    .Where(s => request.ServiceIds.Contains(s.Id))
                    .ToList();

                provider.Services.Clear();
                foreach (var s in targetServices)
                {
                    provider.Services.Add(s);
                }
            }

            _dbContext.SaveChanges();
            return MapToProviderResponse(provider);
        }

        public List<ServiceResponse> GetAllServices()
        {
            return _dbContext.Services
                .Include(s => s.Category)
                .Select(s => MapToServiceResponse(s))
                .ToList();
        }

        public ServiceResponse GetServiceById(long id)
        {
            var service = _dbContext.Services
                .Include(s => s.Category)
                .FirstOrDefault(s => s.Id == id)
                ?? throw new KeyNotFoundException($"Service not found with ID: {id}");

            return MapToServiceResponse(service);
        }

        public List<CategoryResponse> GetAllCategories()
        {
            return _dbContext.Categories.Select(c => MapToCategoryResponse(c)).ToList();
        }

        public CategoryResponse GetCategoryById(long id)
        {
            var category = _dbContext.Categories.FirstOrDefault(c => c.Id == id)
                ?? throw new KeyNotFoundException($"Category not found with ID: {id}");

            return MapToCategoryResponse(category);
        }

        public List<BookingResponse> GetAllBookings()
        {
            return _dbContext.Bookings
                .Include(b => b.Customer)
                .Include(b => b.Provider)
                .Include(b => b.Service)
                .Select(b => MapToBookingResponse(b))
                .ToList();
        }

        public BookingResponse GetBookingById(long id)
        {
            var booking = _dbContext.Bookings
                .Include(b => b.Customer)
                .Include(b => b.Provider)
                .Include(b => b.Service)
                .FirstOrDefault(b => b.Id == id)
                ?? throw new KeyNotFoundException($"Booking not found with ID: {id}");

            return MapToBookingResponse(booking);
        }

        private static AdminResponse MapToAdminResponse(Admin admin)
        {
            return new AdminResponse(
                admin.Id,
                admin.Name,
                admin.Email,
                admin.Phone,
                admin.Role,
                admin.Department,
                admin.CreatedAt
            );
        }

        private static UserResponse MapToUserResponse(User user)
        {
            return new UserResponse
            {
                Id = user.Id,
                Name = user.Name,
                Email = user.Email,
                Phone = user.Phone,
                Role = user.Role,
                Active = user.IsActive,
                CreatedAt = user.CreatedAt
            };
        }

        private static ServiceProviderResponse MapToProviderResponse(ServiceProvider provider)
        {
            var serviceIds = provider.Services?.Select(s => s.Id).ToList() ?? new List<long>();
            var serviceNames = provider.Services?.Select(s => s.Name).ToList() ?? new List<string>();

            return new ServiceProviderResponse(
                provider.Id,
                provider.User?.Id,
                provider.User?.Name,
                provider.User?.Email,
                provider.User?.Phone,
                provider.CompanyName,
                provider.ExperienceYears,
                provider.Bio,
                provider.IsVerified,
                provider.Rating,
                provider.CompanyAvailable,
                serviceIds,
                serviceNames
            );
        }

        private static ServiceResponse MapToServiceResponse(Service service)
        {
            return new ServiceResponse(
                service.Id,
                service.Category?.Id,
                service.Category?.Name,
                service.Name,
                service.Description,
                service.Price,
                service.Duration
            );
        }

        private static CategoryResponse MapToCategoryResponse(Category category)
        {
            return new CategoryResponse(
                category.Id,
                category.Name,
                category.Description
            );
        }

        private static BookingResponse MapToBookingResponse(Booking booking)
        {
            return new BookingResponse(
                booking.Id,
                booking.Customer?.Id,
                booking.Customer?.Name,
                booking.Customer?.Email,
                booking.Provider?.Id,
                booking.Provider?.CompanyName,
                booking.Service?.Id,
                booking.Service?.Name,
                booking.BookingDate,
                booking.BookingTime,
                booking.Status,
                booking.TotalPrice,
                booking.CreatedAt
            );
        }
    }
}
