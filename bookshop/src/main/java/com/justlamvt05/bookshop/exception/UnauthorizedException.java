package com.justlamvt05.bookshop.exception;

public class UnauthorizedException extends org.springframework.security.core.AuthenticationException {

    public UnauthorizedException(String msg) {
        super(msg);
    }
}