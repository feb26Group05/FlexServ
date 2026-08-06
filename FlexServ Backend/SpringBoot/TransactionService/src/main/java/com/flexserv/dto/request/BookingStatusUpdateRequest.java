package com.flexserv.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class BookingStatusUpdateRequest {

    @NotBlank(message = "Status is required")
    private String status;

    private String reason;
}
