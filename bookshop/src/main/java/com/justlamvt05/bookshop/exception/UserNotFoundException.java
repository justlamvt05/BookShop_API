package com.justlamvt05.bookshop.exception;

import lombok.Getter;

@Getter
public class UserNotFoundException extends RuntimeException {
    private final String customMessage;

    public UserNotFoundException(String msg) {
        this.customMessage = msg;
    }
}