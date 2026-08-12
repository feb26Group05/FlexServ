using System.ComponentModel.DataAnnotations;

namespace AdminService.Dtos
{
    public class UpdateUserRequest
    {
        [Required]
        [StringLength(100)]
        public string Name { get; set; } = string.Empty;

        [Required]
        [StringLength(15)]
        public string Phone { get; set; } = string.Empty;
    }
}
