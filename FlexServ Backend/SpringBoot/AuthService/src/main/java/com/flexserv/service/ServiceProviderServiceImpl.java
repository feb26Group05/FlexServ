package com.flexserv.service;

import com.flexserv.dto.request.ServiceProviderRequestDto;
import com.flexserv.dto.response.ServiceProviderResponseDto;
import com.flexserv.entity.ServiceEntity;
import com.flexserv.entity.ServiceProviderCompany;
import com.flexserv.entity.User;
import com.flexserv.repository.ServiceProviderCompanyRepository;
import com.flexserv.repository.ServiceRepository;
import com.flexserv.repository.UserRepository;
import com.flexserv.service.ServiceProviderService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.flexserv.exception.ResourceNotFoundException;

import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ServiceProviderServiceImpl implements ServiceProviderService {

    private final ServiceProviderCompanyRepository providerRepository;
    private final UserRepository userRepository;
    private final ServiceRepository serviceRepository;

    @Override
    @Transactional
    public ServiceProviderResponseDto createProvider(ServiceProviderRequestDto requestDto) {
        User user = userRepository.findById(requestDto.getUserId())
                .orElseThrow(() -> new RuntimeException("User not found with id: " + requestDto.getUserId()));

        ServiceProviderCompany provider = new ServiceProviderCompany();
        provider.setUser(user);
        provider.setCompanyName(requestDto.getCompanyName());
        provider.setExperienceYears(requestDto.getExperienceYears());
        provider.setBio(requestDto.getBio());

        if (requestDto.getServiceIds() != null && !requestDto.getServiceIds().isEmpty()) {
            List<ServiceEntity> services = serviceRepository.findAllById(requestDto.getServiceIds());
            provider.setServices(Set.copyOf(services));
        }

        ServiceProviderCompany saved = providerRepository.save(provider);
        return mapToDto(saved);
    }

    @Override
    @Transactional(readOnly = true)
    public ServiceProviderResponseDto getProviderById(Long providerId) {
        ServiceProviderCompany provider = providerRepository.findById(providerId)
                .orElseThrow(() -> new ResourceNotFoundException("Provider not found with id: " + providerId));
        return mapToDto(provider);
    }
    
    @Override
    @Transactional(readOnly = true)
    public ServiceProviderResponseDto getProviderByUserId(Long userId) {
        ServiceProviderCompany provider = providerRepository.findByUserId(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Provider profile not found for user: " + userId));
        return mapToDto(provider);
    }
   
    @Override
    @Transactional(readOnly = true)
    public List<ServiceProviderResponseDto> getAllProviders(Long categoryId, String keyword) {
        List<ServiceProviderCompany> providers;

        if (categoryId != null) {
            providers = providerRepository.findByServices_Category_Id(categoryId);
        } else if (keyword != null && !keyword.trim().isEmpty()) {
            providers = providerRepository.searchProviders(keyword.trim());
        } else {
            providers = providerRepository.findAll();
        }

        return providers.stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<ServiceProviderResponseDto> getAllAvailableProviders() {
        return providerRepository.findByCompanyAvailableTrue()
                .stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public ServiceProviderResponseDto updateAvailability(Long providerId, Boolean isAvailable) {
        ServiceProviderCompany provider = providerRepository.findById(providerId)
                .orElseThrow(() -> new RuntimeException("Provider not found with id: " + providerId));
        provider.setCompanyAvailable(isAvailable);
        return mapToDto(providerRepository.save(provider));
    }

    @Override
    @Transactional
    public ServiceProviderResponseDto addServicesToProvider(Long providerId, Set<Long> serviceIds) {
        ServiceProviderCompany provider = providerRepository.findById(providerId)
                .orElseThrow(() -> new RuntimeException("Provider not found with id: " + providerId));

        List<ServiceEntity> services = serviceRepository.findAllById(serviceIds);
        provider.getServices().addAll(services);

        return mapToDto(providerRepository.save(provider));
    }

    private ServiceProviderResponseDto mapToDto(ServiceProviderCompany provider) {
        ServiceProviderResponseDto dto = new ServiceProviderResponseDto();
        dto.setId(provider.getId());
        
        if (provider.getUser() != null) {
            dto.setUserId(provider.getUser().getId());
            dto.setUserName(provider.getUser().getName());
            dto.setUserEmail(provider.getUser().getEmail());
        }
        
        dto.setCompanyName(provider.getCompanyName());
        dto.setExperienceYears(provider.getExperienceYears());
        dto.setBio(provider.getBio());
        dto.setIsVerified(provider.getIsVerified());
        dto.setRating(provider.getRating());
        dto.setCompanyAvailable(provider.getCompanyAvailable());
        
        if (provider.getServices() != null) {
            dto.setOfferedServices(
                provider.getServices().stream().map(ServiceEntity::getName).collect(Collectors.toSet())
            );
        }
        
        return dto;
    }
}