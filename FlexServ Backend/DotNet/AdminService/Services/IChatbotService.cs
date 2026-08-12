using AdminService.Dtos;
using System.Threading.Tasks;

namespace AdminService.Services
{
    public interface IChatbotService
    {
        Task<ChatResponse> GetRecommendationAsync(string userPrompt);
    }
}
