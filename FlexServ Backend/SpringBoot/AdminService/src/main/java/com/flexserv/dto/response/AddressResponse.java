package com.flexserv.dto.response;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class AddressResponse {

    private Long id;
    private String houseNo;
    private String street;
    private String area;
    private String city;
    private String state;
    private String pincode;
}