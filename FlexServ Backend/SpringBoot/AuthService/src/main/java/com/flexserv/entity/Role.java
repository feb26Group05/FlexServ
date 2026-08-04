package com.flexserv.entity;

public enum Role {
    USER,
    ADMIN,
    PROVIDER,
	CUSTOMER,
    provider, // Added to handle lowercase database entries
    user,
    admin,
	customer
}