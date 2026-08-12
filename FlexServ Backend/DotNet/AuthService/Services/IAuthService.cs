using AuthService.Dtos;

namespace AuthService.Services
{
    public interface IAuthService
    {
        UserResponse Register(RegisterRequest request);
        AuthenticationResult Login(LoginRequest request);
    }
}
