package com.justlamvt05.bookshop.exception;

import lombok.Getter;

@Getter
public class EntityNotFoundException extends RuntimeException {
    private final String customMessage;

    public EntityNotFoundException(String msg) {
        this.customMessage = msg;
    }
}