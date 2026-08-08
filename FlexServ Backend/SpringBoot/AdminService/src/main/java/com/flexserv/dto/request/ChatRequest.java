package com.flexserv.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ChatRequest {
    @NotBlank(message = "Message cannot be empty")
    private String message;
}