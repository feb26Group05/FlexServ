package com.flexserv.controller;

import com.flexserv.dto.request.*;
import com.flexserv.dto.response.*;
import com.flexserv.service.ServiceProviderService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.flexserv.dto.request.UpdateServiceProviderRequestDto;

import java.util.List;
import java.util.Set;

@RestController
@RequestMapping("/api/providers")
@RequiredArgsConstructor
public class ServiceProviderController {

    private final ServiceProviderService providerService;

    @GetMapping
    public ResponseEntity<List<ServiceProviderResponseDto>> getAllProviders(
            @RequestParam(required = false) Long categoryId,
            @RequestParam(required = false) String keyword) {
        return ResponseEntity.ok(providerService.getAllProviders(categoryId, keyword));
    }


    @PostMapping
    public ResponseEntity<ServiceProviderResponseDto> createProvider(@RequestBody ServiceProviderRequestDto requestDto) {
        return new ResponseEntity<>(providerService.createProvider(requestDto), HttpStatus.CREATED);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ServiceProviderResponseDto> getProviderById(@PathVariable Long id) {
        return ResponseEntity.ok(providerService.getProviderById(id));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ServiceProviderResponseDto> updateProvider(
            @PathVariable Long id,
            @RequestBody UpdateServiceProviderRequestDto requestDto) {

        return ResponseEntity.ok(providerService.updateProvider(id, requestDto));
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<ServiceProviderResponseDto> getProviderByUserId(@PathVariable Long userId) {
        return ResponseEntity.ok(providerService.getProviderByUserId(userId));
    }

    @GetMapping("/available")
    public ResponseEntity<List<ServiceProviderResponseDto>> getAvailableProviders() {
        return ResponseEntity.ok(providerService.getAllAvailableProviders());
    }

    // @PatchMapping("/{id}/availability")
    // public ResponseEntity<ServiceProviderResponseDto> updateAvailability(
    //         @PathVariable Long id,
    //         @RequestParam Boolean available) {
    //     return ResponseEntity.ok(providerService.updateAvailability(id, available));
    // }

    @PostMapping("/{id}/services")
    public ResponseEntity<ServiceProviderResponseDto> addServices(
            @PathVariable Long id,
            @RequestBody Set<Long> serviceIds) {
        return ResponseEntity.ok(providerService.addServicesToProvider(id, serviceIds));
    }
}