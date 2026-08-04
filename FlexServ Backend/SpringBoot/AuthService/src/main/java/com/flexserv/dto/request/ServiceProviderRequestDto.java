package com.flexserv.dto.request;

import lombok.Data;
import java.util.Set;

@Data
public class ServiceProviderRequestDto {
    private Long userId;
    private String companyName;
    private Integer experienceYears;
    private String bio;
    private Set<Long> serviceIds;
}