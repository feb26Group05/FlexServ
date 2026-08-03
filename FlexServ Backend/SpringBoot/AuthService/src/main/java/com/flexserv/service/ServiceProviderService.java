package com.flexserv.service;

import com.flexserv.dto.request.ServiceProviderRequestDto;
import com.flexserv.dto.response.ServiceProviderResponseDto;

import java.util.List;
import java.util.Set;

public interface ServiceProviderService {
    ServiceProviderResponseDto createProvider(ServiceProviderRequestDto requestDto);
    
    ServiceProviderResponseDto getProviderById(Long providerId);
    
    ServiceProviderResponseDto getProviderByUserId(Long userId);
    
    List<ServiceProviderResponseDto> getAllProviders(Long categoryId, String keyword);
    
    List<ServiceProviderResponseDto> getAllAvailableProviders();
    
    ServiceProviderResponseDto updateAvailability(Long providerId, Boolean isAvailable);
    
    ServiceProviderResponseDto addServicesToProvider(Long providerId, Set<Long> serviceIds);
}