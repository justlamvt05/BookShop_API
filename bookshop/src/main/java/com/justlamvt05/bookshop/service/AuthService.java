package com.justlamvt05.bookshop.service;

import com.justlamvt05.bookshop.domain.dto.UserDto;
import com.justlamvt05.bookshop.payload.request.RegisterRequest;
import com.justlamvt05.bookshop.payload.response.ApiResponse;


public interface AuthService {
   UserDto login(String username, String password);
   ApiResponse<?> register(RegisterRequest request);
}
