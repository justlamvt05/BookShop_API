package com.justlamvt05.bookshop.exception;

public class OrderNotFoundException extends RuntimeException {
    private final String customMessage;

    public OrderNotFoundException(String customMessage) {
        this.customMessage = customMessage;
    }
}
