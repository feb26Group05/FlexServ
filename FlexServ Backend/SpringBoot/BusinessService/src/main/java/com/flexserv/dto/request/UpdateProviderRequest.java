package com.flexserv.dto.request;

import java.util.Set;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class UpdateProviderRequest {

    private String userName;

    private String userPhone;

    private String companyName;

    private Integer experienceYears;

    private String bio;

    private Set<Long> serviceIds;
}
