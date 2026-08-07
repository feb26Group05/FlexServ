package com.flexserv.entity;

import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;

@Converter(autoApply = true)
public class RoleConverter implements AttributeConverter<Role, String> {

    @Override
    public String convertToDatabaseColumn(Role role) {
        if (role == null) {
            return null;
        }
        return role.name();
    }

    @Override
    public Role convertToEntityAttribute(String dbData) {
        if (dbData == null || dbData.isBlank()) {
            return Role.CUSTOMER;
        }
        String val = dbData.trim().toUpperCase();
        try {
            return Role.valueOf(val);
        } catch (IllegalArgumentException e) {
            if (val.contains("PROVIDER") || val.contains("SERVICE")) {
                return Role.PROVIDER;
            }
            if (val.contains("ADMIN")) {
                return Role.ADMIN;
            }
            return Role.CUSTOMER;
        }
    }
}
