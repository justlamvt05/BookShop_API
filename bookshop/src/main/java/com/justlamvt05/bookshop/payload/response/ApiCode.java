package com.justlamvt05.bookshop.payload.response;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@RequiredArgsConstructor
public enum ApiCode {
    SUCCESS("S001", "Success"),
    CREATED("S002", "Created"),
    BAD_REQUEST("E001", "Bad Request"),
    NOT_FOUND("E002", "Entity Not Found"),
    CONFLICT("E003", "Conflict"),
    INTERNAL_ERROR("E004", "Internal Error"),
    UNAUTHORIZED("E005", "Unauthorized"),
    VALIDATION_ERROR("E006", "Validation Error"),
    UNAUTHORIZED_USER("E007", "Invalid username or password"),;

    private final String code;
    private final String message;

}

