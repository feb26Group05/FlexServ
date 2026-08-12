using AuthService.Models;

namespace AuthService.Dtos
{
    public class LoginResponse
    {
        public long Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public Role Role { get; set; }

        public LoginResponse() { }

        public LoginResponse(long id, string name, Role role)
        {
            Id = id;
            Name = name;
            Role = role;
        }
    }
}
