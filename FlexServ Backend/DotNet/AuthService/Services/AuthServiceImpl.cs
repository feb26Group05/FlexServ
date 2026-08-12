using AuthService.Data;
using AuthService.Dtos;
using AuthService.Models;
using System;
using System.Linq;

namespace AuthService.Services
{
    public class AuthServiceImpl : IAuthService
    {
        private readonly AuthDbContext _dbContext;
        private readonly IJwtService _jwtService;

        public AuthServiceImpl(AuthDbContext dbContext, IJwtService jwtService)
        {
            _dbContext = dbContext;
            _jwtService = jwtService;
        }

        public UserResponse Register(RegisterRequest request)
        {
            if (_dbContext.Users.Any(u => u.Email == request.Email))
            {
                throw new InvalidOperationException("Email already exists");
            }

            if (_dbContext.Users.Any(u => u.Phone == request.Phone))
            {
                throw new InvalidOperationException("Phone number already exists");
            }

            var user = new User
            {
                Name = request.Name,
                Email = request.Email,
                Phone = request.Phone,
                Password = BCrypt.Net.BCrypt.HashPassword(request.Password),
                Role = request.Role ?? Role.CUSTOMER,
                IsActive = true,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            };

            _dbContext.Users.Add(user);
            _dbContext.SaveChanges();

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

        public AuthenticationResult Login(LoginRequest request)
        {
            var user = _dbContext.Users.FirstOrDefault(u => u.Email == request.Email);
            if (user == null || !BCrypt.Net.BCrypt.Verify(request.Password, user.Password))
            {
                throw new InvalidOperationException("Invalid email or password");
            }

            var token = _jwtService.GenerateToken(user);
            var loginResponse = new LoginResponse(user.Id, user.Name, user.Role);

            return new AuthenticationResult(token, loginResponse);
        }
    }
}
