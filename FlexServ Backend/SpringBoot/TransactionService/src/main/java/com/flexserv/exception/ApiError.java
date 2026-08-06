package com.flexserv.exception;

import java.time.LocalDateTime;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ApiError {
    private Boolean success = false;
    private String message;
    private LocalDateTime timestamp = LocalDateTime.now();

    public ApiError(String message) {
        this.message = message;
    }
}
