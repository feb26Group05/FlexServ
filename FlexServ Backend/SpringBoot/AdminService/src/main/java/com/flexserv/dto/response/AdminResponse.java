package com.flexserv.dto.response;

import java.time.LocalDateTime;

import com.flexserv.entity.Role;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class AdminResponse {

    private Long id;

    private String name;

    private String email;

    private String phone;

    private Role role;

    private String department;

    private Boolean isActive;

    private LocalDateTime createdAt;
}
