using AdminService.Dtos;
using AdminService.Services;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;

namespace AdminService.Controllers
{
    [ApiController]
    [Route("api/chat")]
    public class ChatbotController : ControllerBase
    {
        private readonly IChatbotService _chatbotService;

        public ChatbotController(IChatbotService chatbotService)
        {
            _chatbotService = chatbotService;
        }

        [HttpPost("recommend")]
        public async Task<IActionResult> GetRecommendation([FromBody] ChatRequest request)
        {
            var response = await _chatbotService.GetRecommendationAsync(request.Message);
            return Ok(new ApiResponse<ChatResponse>(true, "Recommendation generated", response));
        }
    }
}
