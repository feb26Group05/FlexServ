using System.ComponentModel.DataAnnotations;

namespace AdminService.Dtos
{
    public class ChatRequest
    {
        [Required]
        public string Message { get; set; } = string.Empty;
    }
}
