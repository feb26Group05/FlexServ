package com.flexserv.entity;

public enum BookingStatus {
    PENDING,
    REQUESTED,
    CONFIRMED,
    IN_PROGRESS,
    COMPLETED,
    CANCELLED,
    REJECTED;

    public static boolean isValidStatus(String status) {
        if (status == null) return false;
        for (BookingStatus bs : values()) {
            if (bs.name().equalsIgnoreCase(status)) {
                return true;
            }
        }
        return false;
    }
}
