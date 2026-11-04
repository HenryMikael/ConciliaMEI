package com.ads.conciliamei.dto;

public record ErrorResponseDTO(
        int status,
        String message,
        String timestamp
) {}
