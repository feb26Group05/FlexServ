using AuthService.Dtos;
using System.Collections.Generic;

namespace AuthService.Services
{
    public interface IServiceProviderService
    {
        ServiceProviderResponseDto CreateProvider(ServiceProviderRequestDto requestDto);
        ServiceProviderResponseDto GetProviderById(long providerId);
        ServiceProviderResponseDto GetProviderByUserId(long userId);
        List<ServiceProviderResponseDto> GetAllProviders(long? categoryId, string? keyword);
        List<ServiceProviderResponseDto> GetAllAvailableProviders();
        ServiceProviderResponseDto UpdateProvider(long providerId, UpdateServiceProviderRequestDto requestDto);
        ServiceProviderResponseDto AddServicesToProvider(long providerId, HashSet<long> serviceIds);
    }
}
