using AdminService.Models;
using System;

namespace AdminService.Dtos
{
    public class AdminResponse
    {
        public long Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string Phone { get; set; } = string.Empty;
        public Role Role { get; set; }
        public string Department { get; set; } = string.Empty;
        public DateTime? CreatedAt { get; set; }

        public AdminResponse() { }

        public AdminResponse(long id, string name, string email, string phone, Role role, string department, DateTime? createdAt)
        {
            Id = id;
            Name = name;
            Email = email;
            Phone = phone;
            Role = role;
            Department = department;
            CreatedAt = createdAt;
        }
    }
}
