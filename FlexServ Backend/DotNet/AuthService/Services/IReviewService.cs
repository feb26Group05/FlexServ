using AuthService.Dtos;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace AuthService.Services
{
    public interface IReviewService
    {
        Task<ReviewResponse> SubmitReviewAsync(ReviewRequest request);
        Task<List<ReviewResponse>> GetReviewsForProviderAsync(long providerId);
        Task<List<ReviewResponse>> GetReviewsByCustomerAsync(long customerId);
    }
}
