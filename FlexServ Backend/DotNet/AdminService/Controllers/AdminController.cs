using AdminService.Dtos;
using AdminService.Models;
using AdminService.Services;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;

namespace AdminService.Controllers
{
    [ApiController]
    [Route("api/admin")]
    public class AdminController : ControllerBase
    {
        private readonly IAdminService _adminService;

        public AdminController(IAdminService adminService)
        {
            _adminService = adminService;
        }

        // 1. POST /api/admin/register
        [HttpPost("register")]
        public IActionResult RegisterAdmin([FromBody] AdminRegisterRequest request)
        {
            try
            {
                var admin = _adminService.RegisterAdmin(request);
                return StatusCode(201, new ApiResponse<AdminResponse>(true, "Admin Registered Successfully", admin));
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(new ApiResponse<AdminResponse>(false, ex.Message, null));
            }
        }

        // 2. GET /api/admin/{id}
        [HttpGet("{id:long}")]
        public IActionResult GetAdminById(long id)
        {
            try
            {
                var admin = _adminService.GetAdminById(id);
                return Ok(new ApiResponse<AdminResponse>(true, "Admin Details Retrieved Successfully", admin));
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(new ApiResponse<AdminResponse>(false, ex.Message, null));
            }
        }

        // 3. GET /api/admin
        [HttpGet]
        public IActionResult GetAllAdmins()
        {
            var admins = _adminService.GetAllAdmins();
            return Ok(new ApiResponse<List<AdminResponse>>(true, "All Admins Retrieved Successfully", admins));
        }

        // 4. GET /api/admin/users
        [HttpGet("users")]
        public IActionResult GetAllUsers()
        {
            var users = _adminService.GetAllUsers();
            return Ok(new ApiResponse<List<UserResponse>>(true, "All Users Retrieved Successfully", users));
        }

        // 5. GET /api/admin/users/{id}
        [HttpGet("users/{id:long}")]
        public IActionResult GetUserById(long id)
        {
            try
            {
                var user = _adminService.GetUserById(id);
                return Ok(new ApiResponse<UserResponse>(true, "User Details Retrieved Successfully", user));
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(new ApiResponse<UserResponse>(false, ex.Message, null));
            }
        }

        // 6. GET /api/admin/users/role/{role}
        [HttpGet("users/role/{role}")]
        public IActionResult GetUsersByRole(Role role)
        {
            var users = _adminService.GetUsersByRole(role);
            return Ok(new ApiResponse<List<UserResponse>>(true, "Users Retrieved Successfully By Role", users));
        }

        // 7. GET /api/admin/providers
        [HttpGet("providers")]
        public IActionResult GetAllProviders()
        {
            var providers = _adminService.GetAllProviders();
            return Ok(new ApiResponse<List<ServiceProviderResponse>>(true, "All Service Providers Retrieved Successfully", providers));
        }

        // 8. GET /api/admin/providers/{id}
        [HttpGet("providers/{id:long}")]
        public IActionResult GetProviderById(long id)
        {
            try
            {
                var provider = _adminService.GetProviderById(id);
                return Ok(new ApiResponse<ServiceProviderResponse>(true, "Service Provider Details Retrieved Successfully", provider));
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(new ApiResponse<ServiceProviderResponse>(false, ex.Message, null));
            }
        }

        // 9. GET /api/admin/providers/user/{userId}
        [HttpGet("providers/user/{userId:long}")]
        public IActionResult GetProviderByUserId(long userId)
        {
            try
            {
                var provider = _adminService.GetProviderByUserId(userId);
                return Ok(new ApiResponse<ServiceProviderResponse>(true, "Service Provider Details Retrieved By User ID", provider));
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(new ApiResponse<ServiceProviderResponse>(false, ex.Message, null));
            }
        }

        // 10. PUT /api/admin/providers/{id}/availability
        [HttpPut("providers/{id:long}/availability")]
        public IActionResult UpdateProviderAvailability(long id, [FromQuery] bool available)
        {
            try
            {
                var provider = _adminService.UpdateProviderAvailability(id, available);
                return Ok(new ApiResponse<ServiceProviderResponse>(true, "Service Provider Availability Updated Successfully", provider));
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(new ApiResponse<ServiceProviderResponse>(false, ex.Message, null));
            }
        }

        // 11. PUT /api/admin/providers/{id}
        [HttpPut("providers/{id:long}")]
        public IActionResult UpdateProviderProfile(long id, [FromBody] UpdateProviderRequest request)
        {
            try
            {
                var provider = _adminService.UpdateProviderProfile(id, request);
                return Ok(new ApiResponse<ServiceProviderResponse>(true, "Service Provider Profile and Offered Services Updated Successfully", provider));
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(new ApiResponse<ServiceProviderResponse>(false, ex.Message, null));
            }
        }

        // 12. GET /api/admin/services
        [HttpGet("services")]
        public IActionResult GetAllServices()
        {
            var services = _adminService.GetAllServices();
            return Ok(new ApiResponse<List<ServiceResponse>>(true, "All Services Retrieved Successfully", services));
        }

        // 13. GET /api/admin/services/{id}
        [HttpGet("services/{id:long}")]
        public IActionResult GetServiceById(long id)
        {
            try
            {
                var service = _adminService.GetServiceById(id);
                return Ok(new ApiResponse<ServiceResponse>(true, "Service Details Retrieved Successfully", service));
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(new ApiResponse<ServiceResponse>(false, ex.Message, null));
            }
        }

        // 14. GET /api/admin/categories
        [HttpGet("categories")]
        public IActionResult GetAllCategories()
        {
            var categories = _adminService.GetAllCategories();
            return Ok(new ApiResponse<List<CategoryResponse>>(true, "All Categories Retrieved Successfully", categories));
        }

        // 15. GET /api/admin/categories/{id}
        [HttpGet("categories/{id:long}")]
        public IActionResult GetCategoryById(long id)
        {
            try
            {
                var category = _adminService.GetCategoryById(id);
                return Ok(new ApiResponse<CategoryResponse>(true, "Category Details Retrieved Successfully", category));
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(new ApiResponse<CategoryResponse>(false, ex.Message, null));
            }
        }

        // 16. GET /api/admin/bookings
        [HttpGet("bookings")]
        public IActionResult GetAllBookings()
        {
            var bookings = _adminService.GetAllBookings();
            return Ok(new ApiResponse<List<BookingResponse>>(true, "All Bookings Retrieved Successfully", bookings));
        }

        // 17. GET /api/admin/bookings/{id}
        [HttpGet("bookings/{id:long}")]
        public IActionResult GetBookingById(long id)
        {
            try
            {
                var booking = _adminService.GetBookingById(id);
                return Ok(new ApiResponse<BookingResponse>(true, "Booking Details Retrieved Successfully", booking));
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(new ApiResponse<BookingResponse>(false, ex.Message, null));
            }
        }
    }
}
