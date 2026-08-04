package com.flexserv.dto.response;

import lombok.Data;
import java.util.Set;

@Data
public class ServiceProviderResponseDto {
    private Long id;
    private Long userId;
    private String userName;
    private String userEmail;
    private String companyName;
    private Integer experienceYears;
    private String bio;
    private Boolean isVerified;
    private Double rating;
    private Boolean companyAvailable;
    private Set<String> offeredServices;
}