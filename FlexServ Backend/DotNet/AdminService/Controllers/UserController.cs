using AdminService.Dtos;
using AdminService.Services;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Security.Claims;

namespace AdminService.Controllers
{
    [ApiController]
    [Route("api/users")]
    [Route("api/user")]
    public class UserController : ControllerBase
    {
        private readonly IUserService _userService;

        public UserController(IUserService userService)
        {
            _userService = userService;
        }

        private long GetCurrentUserId()
        {
            var userIdClaim = User.FindFirstValue(ClaimTypes.NameIdentifier) ?? User.FindFirstValue("sub");
            if (long.TryParse(userIdClaim, out var userId))
            {
                return userId;
            }
            // Fallback for testing/unauthenticated calls
            return 1;
        }

        [HttpGet("profile")]
        public IActionResult GetProfile()
        {
            try
            {
                var userId = GetCurrentUserId();
                var user = _userService.GetUserProfile(userId);
                return Ok(new ApiResponse<UserResponse>(true, "Profile fetched successfully", user));
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(new ApiResponse<UserResponse>(false, ex.Message, null));
            }
        }

        [HttpPut("profile")]
        public IActionResult UpdateProfile([FromBody] UpdateUserRequest request)
        {
            try
            {
                var userId = GetCurrentUserId();
                var updatedUser = _userService.UpdateUserProfile(userId, request);
                return Ok(new ApiResponse<UserResponse>(true, "Profile updated successfully", updatedUser));
            }
            catch (Exception ex) when (ex is KeyNotFoundException || ex is InvalidOperationException)
            {
                return BadRequest(new ApiResponse<UserResponse>(false, ex.Message, null));
            }
        }

        [HttpDelete("profile")]
        public IActionResult DeleteAccount()
        {
            try
            {
                var userId = GetCurrentUserId();
                _userService.DeleteUserAccount(userId);
                return Ok(new ApiResponse<string>(true, "Account deleted successfully", null));
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(new ApiResponse<string>(false, ex.Message, null));
            }
        }

        [HttpPost("addresses")]
        public IActionResult AddAddress([FromBody] AddressRequest request)
        {
            try
            {
                var userId = GetCurrentUserId();
                var address = _userService.AddAddress(userId, request);
                return Created(string.Empty, new ApiResponse<AddressResponse>(true, "Address added successfully", address));
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(new ApiResponse<AddressResponse>(false, ex.Message, null));
            }
        }

        [HttpGet("addresses")]
        public IActionResult GetAddresses()
        {
            try
            {
                var userId = GetCurrentUserId();
                var addresses = _userService.GetUserAddresses(userId);
                return Ok(new ApiResponse<List<AddressResponse>>(true, "Addresses fetched successfully", addresses));
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(new ApiResponse<List<AddressResponse>>(false, ex.Message, null));
            }
        }

        [HttpPut("addresses/{addressId:long}")]
        public IActionResult UpdateAddress(long addressId, [FromBody] AddressRequest request)
        {
            try
            {
                var userId = GetCurrentUserId();
                var address = _userService.UpdateAddress(userId, addressId, request);
                return Ok(new ApiResponse<AddressResponse>(true, "Address updated successfully", address));
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(new ApiResponse<AddressResponse>(false, ex.Message, null));
            }
        }

        [HttpDelete("addresses/{addressId:long}")]
        public IActionResult DeleteAddress(long addressId)
        {
            try
            {
                var userId = GetCurrentUserId();
                _userService.DeleteAddress(userId, addressId);
                return Ok(new ApiResponse<string>(true, "Address deleted successfully", null));
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(new ApiResponse<string>(false, ex.Message, null));
            }
        }
    }
}
