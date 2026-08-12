using AuthService.Dtos;
using AuthService.Services;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace AuthService.Controllers
{
    [ApiController]
    [Route("api/reviews")]
    public class ReviewController : ControllerBase
    {
        private readonly IReviewService _reviewService;

        public ReviewController(IReviewService reviewService)
        {
            _reviewService = reviewService;
        }

        [HttpPost]
        public async Task<IActionResult> SubmitReview([FromBody] ReviewRequest request)
        {
            try
            {
                var response = await _reviewService.SubmitReviewAsync(request);
                return StatusCode(201, response);
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(ex.Message);
            }
        }

        [HttpGet("provider/{providerId:long}")]
        public async Task<IActionResult> GetReviewsForProvider(long providerId)
        {
            var reviews = await _reviewService.GetReviewsForProviderAsync(providerId);
            return Ok(reviews);
        }

        [HttpGet("customer/{customerId:long}")]
        public async Task<IActionResult> GetReviewsByCustomer(long customerId)
        {
            var reviews = await _reviewService.GetReviewsByCustomerAsync(customerId);
            return Ok(reviews);
        }
    }
}
