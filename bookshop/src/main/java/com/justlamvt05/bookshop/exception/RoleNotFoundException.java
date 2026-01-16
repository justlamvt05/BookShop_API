package com.justlamvt05.bookshop.exception;

import lombok.Getter;

@Getter
public class RoleNotFoundException extends RuntimeException {
    private final String customMessage;

    public RoleNotFoundException(String msg) {
        this.customMessage = msg;
    }
}