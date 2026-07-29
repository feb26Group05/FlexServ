package com.flexserv.dto.response;

import java.math.BigDecimal;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ServiceProviderResponse {

    private Long id;

    private Long userId;

    private String userName;

    private String userEmail;

    private String userPhone;

    private String companyName;

    private Integer experienceYears;

    private String bio;

    private Boolean isVerified;

    private BigDecimal rating;

    private Boolean companyAvailable;
}
