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
public class ServiceResponse {

    private Long id;

    private Long categoryId;

    private String categoryName;

    private String name;

    private String description;

    private BigDecimal price;

    private Integer duration;

    private Boolean isActive;
}
