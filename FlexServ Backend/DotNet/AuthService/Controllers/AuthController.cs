using AuthService.Dtos;
using AuthService.Services;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System;

namespace AuthService.Controllers
{
    [ApiController]
    [Route("api/auth")]
    public class AuthController : ControllerBase
    {
        private readonly IAuthService _authService;

        public AuthController(IAuthService authService)
        {
            _authService = authService;
        }

        [HttpPost("register")]
        public IActionResult Register([FromBody] RegisterRequest request)
        {
            try
            {
                var userResponse = _authService.Register(request);
                var apiResponse = new ApiResponse<UserResponse>(true, "User Registered Successfully", userResponse);
                return Created(string.Empty, apiResponse);
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(new ApiResponse<UserResponse>(false, ex.Message, null));
            }
        }

        [HttpPost("login")]
        public IActionResult Login([FromBody] LoginRequest request)
        {
            try
            {
                var authResult = _authService.Login(request);

                var cookieOptions = new CookieOptions
                {
                    HttpOnly = true,
                    Secure = false,
                    Path = "/",
                    Expires = DateTimeOffset.UtcNow.AddMinutes(15)
                };
                Response.Cookies.Append("JWT", authResult.Token, cookieOptions);

                var apiResponse = new ApiResponse<LoginResponse>(true, "Login Successful", authResult.LoginResponse);
                return Ok(apiResponse);
            }
            catch (InvalidOperationException ex)
            {
                return Unauthorized(new ApiResponse<LoginResponse>(false, ex.Message, null));
            }
        }

        [HttpPost("logout")]
        public IActionResult Logout()
        {
            var cookieOptions = new CookieOptions
            {
                HttpOnly = true,
                Secure = false,
                Path = "/",
                Expires = DateTimeOffset.UtcNow.AddDays(-1)
            };
            Response.Cookies.Append("JWT", "", cookieOptions);
            Response.Cookies.Delete("JWT");

            var apiResponse = new ApiResponse<string>(true, "Logged out successfully", null);
            return Ok(apiResponse);
        }
    }
}
