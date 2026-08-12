using AuthService.Data;
using AuthService.Dtos;
using AuthService.Models;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace AuthService.Services
{
    public class ReviewServiceImpl : IReviewService
    {
        private readonly AuthDbContext _dbContext;

        public ReviewServiceImpl(AuthDbContext dbContext)
        {
            _dbContext = dbContext;
        }

        public async Task<ReviewResponse> SubmitReviewAsync(ReviewRequest request)
        {
            var customer = await _dbContext.Users.FindAsync(request.CustomerId)
                ?? throw new KeyNotFoundException($"Customer not found with id: {request.CustomerId}");

            var provider = await _dbContext.ServiceProviderCompanies.FindAsync(request.ProviderId)
                ?? throw new KeyNotFoundException($"Provider not found with id: {request.ProviderId}");

            var review = new Review
            {
                BookingId = request.BookingId,
                CustomerId = customer.Id,
                Customer = customer,
                ProviderId = provider.Id,
                Provider = provider,
                Rating = request.Rating,
                Comment = request.Comment,
                CreatedAt = DateTime.UtcNow
            };

            _dbContext.Reviews.Add(review);
            await _dbContext.SaveChangesAsync();

            return MapToResponse(review);
        }

        public async Task<List<ReviewResponse>> GetReviewsForProviderAsync(long providerId)
        {
            var reviews = await _dbContext.Reviews
                .Include(r => r.Customer)
                .Include(r => r.Provider)
                .Where(r => r.ProviderId == providerId)
                .OrderByDescending(r => r.CreatedAt)
                .ToListAsync();

            return reviews.Select(MapToResponse).ToList();
        }

        public async Task<List<ReviewResponse>> GetReviewsByCustomerAsync(long customerId)
        {
            var reviews = await _dbContext.Reviews
                .Include(r => r.Customer)
                .Include(r => r.Provider)
                .Where(r => r.CustomerId == customerId)
                .OrderByDescending(r => r.CreatedAt)
                .ToListAsync();

            return reviews.Select(MapToResponse).ToList();
        }

        private static ReviewResponse MapToResponse(Review review)
        {
            return new ReviewResponse
            {
                Id = review.Id,
                BookingId = review.BookingId,
                CustomerName = review.Customer?.Name,
                ProviderName = review.Provider?.CompanyName,
                Rating = review.Rating,
                Comment = review.Comment,
                CreatedAt = review.CreatedAt
            };
        }
    }
}
