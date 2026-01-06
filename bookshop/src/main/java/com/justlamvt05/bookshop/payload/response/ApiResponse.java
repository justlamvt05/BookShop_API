package com.justlamvt05.bookshop.payload.response;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ApiResponse<T> {

    @JsonIgnore
    private ApiCode apiCode;
    private boolean status;
    private String message;
    private T data;

    public String getCode() {
        return apiCode.getCode();
    }

    public static ApiResponse<String> success() {
        return new ApiResponse<String>(ApiCode.SUCCESS,true, ApiCode.SUCCESS.getMessage(), null);
    }
    public static  ApiResponse<String> create() {
        return new ApiResponse<>(ApiCode.CREATED, true, ApiCode.CREATED.getMessage(), null);
    }
    public static <T> ApiResponse<T> success(T data) {
        return new ApiResponse<>(ApiCode.SUCCESS, true, ApiCode.SUCCESS.getMessage(), data);
    }

    public static <T> ApiResponse<T> create(T data) {
        return new ApiResponse<>(ApiCode.CREATED, true, ApiCode.CREATED.getMessage(), data);
    }


    public static <T> ApiResponse<T> error(ApiCode apiCode) {
        return new ApiResponse<>(apiCode, false, apiCode.getMessage(), null);
    }

    public static <T> ApiResponse<T> error(ApiCode apiCode, String customMsg) {
        return new ApiResponse<>(apiCode, false, customMsg, null);
    }

    public static <T> ApiResponse<T> errorWithData(ApiCode apiCode, T data) {
        return new ApiResponse<>(apiCode, false, apiCode.getMessage(), data);
    }

}

