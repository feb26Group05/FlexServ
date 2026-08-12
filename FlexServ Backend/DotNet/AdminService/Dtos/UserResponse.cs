using AdminService.Models;
using System;

namespace AdminService.Dtos
{
    public class UserResponse
    {
        public long Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string Phone { get; set; } = string.Empty;
        public Role Role { get; set; }
        public bool Active { get; set; } = true;
        public DateTime? CreatedAt { get; set; }
    }
}
