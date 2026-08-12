using AdminService.Dtos;
using AdminService.Models;
using System.Collections.Generic;

namespace AdminService.Services
{
    public interface IAdminService
    {
        AdminResponse RegisterAdmin(AdminRegisterRequest request);
        AdminResponse GetAdminById(long id);
        List<AdminResponse> GetAllAdmins();

        List<UserResponse> GetAllUsers();
        UserResponse GetUserById(long id);
        List<UserResponse> GetUsersByRole(Role role);

        List<ServiceProviderResponse> GetAllProviders();
        ServiceProviderResponse GetProviderById(long id);
        ServiceProviderResponse GetProviderByUserId(long userId);
        ServiceProviderResponse UpdateProviderAvailability(long providerId, bool available);
        ServiceProviderResponse UpdateProviderProfile(long providerId, UpdateProviderRequest request);

        List<ServiceResponse> GetAllServices();
        ServiceResponse GetServiceById(long id);

        List<CategoryResponse> GetAllCategories();
        CategoryResponse GetCategoryById(long id);

        List<BookingResponse> GetAllBookings();
        BookingResponse GetBookingById(long id);
    }
}
