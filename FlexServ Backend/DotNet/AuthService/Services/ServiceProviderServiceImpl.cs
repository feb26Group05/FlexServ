using AuthService.Data;
using AuthService.Dtos;
using AuthService.Models;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;

namespace AuthService.Services
{
    public class ServiceProviderServiceImpl : IServiceProviderService
    {
        private readonly AuthDbContext _dbContext;

        public ServiceProviderServiceImpl(AuthDbContext dbContext)
        {
            _dbContext = dbContext;
        }

        public ServiceProviderResponseDto CreateProvider(ServiceProviderRequestDto requestDto)
        {
            var user = _dbContext.Users.FirstOrDefault(u => u.Id == requestDto.UserId)
                ?? throw new KeyNotFoundException($"User not found with id: {requestDto.UserId}");

            var provider = new ServiceProviderCompany
            {
                UserId = user.Id,
                User = user,
                CompanyName = requestDto.CompanyName,
                ExperienceYears = requestDto.ExperienceYears,
                Bio = requestDto.Bio,
                IsVerified = false,
                Rating = 0.0,
                CompanyAvailable = true
            };

            if (requestDto.ServiceIds != null && requestDto.ServiceIds.Count > 0)
            {
                var services = _dbContext.Services.Where(s => requestDto.ServiceIds.Contains(s.Id)).ToList();
                provider.Services = services;
            }

            _dbContext.ServiceProviderCompanies.Add(provider);
            _dbContext.SaveChanges();

            return MapToDto(provider);
        }

        public ServiceProviderResponseDto GetProviderById(long providerId)
        {
            var provider = _dbContext.ServiceProviderCompanies
                .Include(p => p.User)
                .Include(p => p.Services)
                .FirstOrDefault(p => p.Id == providerId)
                ?? throw new KeyNotFoundException($"Provider not found with id: {providerId}");

            return MapToDto(provider);
        }

        public ServiceProviderResponseDto GetProviderByUserId(long userId)
        {
            var provider = _dbContext.ServiceProviderCompanies
                .Include(p => p.User)
                .Include(p => p.Services)
                .FirstOrDefault(p => p.UserId == userId)
                ?? throw new KeyNotFoundException($"Provider profile not found for user: {userId}");

            return MapToDto(provider);
        }

        public List<ServiceProviderResponseDto> GetAllProviders(long? categoryId, string? keyword)
        {
            IQueryable<ServiceProviderCompany> query = _dbContext.ServiceProviderCompanies
                .Include(p => p.User)
                .Include(p => p.Services);

            if (categoryId.HasValue)
            {
                query = query.Where(p => p.Services.Any(s => s.CategoryId == categoryId.Value));
            }
            else if (!string.IsNullOrWhiteSpace(keyword))
            {
                var trimKeyword = keyword.Trim().ToLower();
                query = query.Where(p =>
                    (p.CompanyName != null && p.CompanyName.ToLower().Contains(trimKeyword)) ||
                    (p.Bio != null && p.Bio.ToLower().Contains(trimKeyword)) ||
                    p.Services.Any(s => s.Name.ToLower().Contains(trimKeyword)));
            }

            return query.Select(p => MapToDto(p)).ToList();
        }

        public List<ServiceProviderResponseDto> GetAllAvailableProviders()
        {
            return _dbContext.ServiceProviderCompanies
                .Include(p => p.User)
                .Include(p => p.Services)
                .Where(p => p.CompanyAvailable == true)
                .Select(p => MapToDto(p))
                .ToList();
        }

        public ServiceProviderResponseDto UpdateProvider(long providerId, UpdateServiceProviderRequestDto requestDto)
        {
            var provider = _dbContext.ServiceProviderCompanies
                .Include(p => p.User)
                .Include(p => p.Services)
                .FirstOrDefault(p => p.Id == providerId)
                ?? throw new KeyNotFoundException($"Provider not found with id: {providerId}");

            provider.CompanyName = requestDto.CompanyName;
            provider.ExperienceYears = requestDto.ExperienceYears;
            provider.Bio = requestDto.Bio;

            _dbContext.SaveChanges();

            return MapToDto(provider);
        }

        public ServiceProviderResponseDto AddServicesToProvider(long providerId, HashSet<long> serviceIds)
        {
            var provider = _dbContext.ServiceProviderCompanies
                .Include(p => p.User)
                .Include(p => p.Services)
                .FirstOrDefault(p => p.Id == providerId)
                ?? throw new KeyNotFoundException($"Provider not found with id: {providerId}");

            var services = _dbContext.Services.Where(s => serviceIds.Contains(s.Id)).ToList();
            foreach (var service in services)
            {
                if (!provider.Services.Any(s => s.Id == service.Id))
                {
                    provider.Services.Add(service);
                }
            }

            _dbContext.SaveChanges();

            return MapToDto(provider);
        }

        private static ServiceProviderResponseDto MapToDto(ServiceProviderCompany provider)
        {
            return new ServiceProviderResponseDto
            {
                Id = provider.Id,
                UserId = provider.User?.Id,
                UserName = provider.User?.Name,
                UserEmail = provider.User?.Email,
                CompanyName = provider.CompanyName,
                ExperienceYears = provider.ExperienceYears,
                Bio = provider.Bio,
                IsVerified = provider.IsVerified,
                Rating = provider.Rating,
                CompanyAvailable = provider.CompanyAvailable,
                OfferedServices = provider.Services != null
                    ? new HashSet<string>(provider.Services.Select(s => s.Name))
                    : new HashSet<string>()
            };
        }
    }
}
