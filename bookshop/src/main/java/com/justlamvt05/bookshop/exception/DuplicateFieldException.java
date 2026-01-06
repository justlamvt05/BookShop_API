package com.justlamvt05.bookshop.exception;

import lombok.Getter;

@Getter
public class DuplicateFieldException extends RuntimeException {
    private final String message;
    public DuplicateFieldException(String message) {
        this.message = message;
    }
}
