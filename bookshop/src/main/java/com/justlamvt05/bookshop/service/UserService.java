package com.justlamvt05.bookshop.service;

import com.justlamvt05.bookshop.domain.dto.OrderDto;
import com.justlamvt05.bookshop.domain.dto.UpdateProfileRequest;
import com.justlamvt05.bookshop.domain.dto.UserProfileDto;
import com.justlamvt05.bookshop.payload.response.ApiResponse;

import java.util.List;

public interface UserService {

    ApiResponse<UserProfileDto> getMyProfile(String userId);

    ApiResponse<UserProfileDto> updateMyProfile(String userId, UpdateProfileRequest request);

    ApiResponse<List<OrderDto>> getMyOrders(String userId);

    ApiResponse<?> getMyOrderDetail(Long orderId);
}

