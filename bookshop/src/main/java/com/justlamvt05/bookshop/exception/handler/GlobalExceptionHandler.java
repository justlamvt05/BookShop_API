package com.justlamvt05.bookshop.exception.handler;


import com.justlamvt05.bookshop.exception.DuplicateFieldException;
import com.justlamvt05.bookshop.exception.RoleNotFoundException;
import com.justlamvt05.bookshop.exception.UserNotFoundException;
import com.justlamvt05.bookshop.exception.UnauthorizedException;
import com.justlamvt05.bookshop.payload.response.ApiCode;
import com.justlamvt05.bookshop.payload.response.ApiResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.AuthenticationException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
@Slf4j
public class GlobalExceptionHandler {

    @ExceptionHandler({NumberFormatException.class})
    public ResponseEntity<ApiResponse<Object>> handleNumberFormatException(NumberFormatException e) {
        return ResponseEntity.badRequest().body(
                ApiResponse.error(ApiCode.BAD_REQUEST, e.getMessage()));
    }

    @ExceptionHandler({UserNotFoundException.class})
    public ResponseEntity<ApiResponse<Object>> handleEntityNotFoundException(UserNotFoundException e) {

        log.error("UserNotFoundException: {}", "User not found");
        return ResponseEntity.badRequest().body(ApiResponse.error(ApiCode.NOT_FOUND, "User not found"));
    }

    @ExceptionHandler({RoleNotFoundException.class})
    public ResponseEntity<ApiResponse<Object>> handleEntityNotFoundException(RoleNotFoundException e) {

        log.error("RoleNotFoundException: {}", "Role not found");
        return ResponseEntity.badRequest().body(ApiResponse.error(ApiCode.NOT_FOUND, "Role not found"));
    }

    @ExceptionHandler({DuplicateFieldException.class})
    public ResponseEntity<ApiResponse<Object>> handleDuplicateFieldException(DuplicateFieldException e) {
        String message = e.getMessage();
        if (message == null) {
            message = ApiCode.CONFLICT.getMessage();
        }
        log.error("DuplicateFieldException: {}", message);
        return ResponseEntity.badRequest().body(ApiResponse.error(ApiCode.CONFLICT, message));
    }

    @ExceptionHandler(UnauthorizedException.class)
    public ResponseEntity<ApiResponse<Object>> handleAuthenticationException(AuthenticationException e) {
        String message = e.getMessage();
        if (message == null) {
            message = ApiCode.UNAUTHORIZED_USER.getMessage();
        }
        log.error("AuthenticationException: {}", message);
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).
                body(ApiResponse.error(ApiCode.UNAUTHORIZED_USER, message));
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ApiResponse<Object>> handleMethodArgumentNotValidException(MethodArgumentNotValidException e) {
        String message = e.getBindingResult().getAllErrors().getFirst().getDefaultMessage();
        if (message == null) {
            message = ApiCode.CONFLICT.getMessage();
        }
        log.error("MethodArgumentNotValidException: {}", message);
        return ResponseEntity.badRequest().body(ApiResponse.error(ApiCode.VALIDATION_ERROR, message));
    }
    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<ApiResponse<Object>> handleIllegalArgumentException(IllegalArgumentException e) {
        String message = e.getMessage();
        if (message == null) {
            message = ApiCode.CONFLICT.getMessage();
        }
        log.error("IllegalArgumentException: {}", message);
        return ResponseEntity.badRequest().body(ApiResponse.error(ApiCode.VALIDATION_ERROR, message));
    }


}

