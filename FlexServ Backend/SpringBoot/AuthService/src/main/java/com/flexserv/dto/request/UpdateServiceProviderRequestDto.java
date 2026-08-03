package com.flexserv.dto.request;

import lombok.Data;

@Data
public class UpdateServiceProviderRequestDto {

    private String companyName;
    private Integer experienceYears;
    private String bio;
}