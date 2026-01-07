package com.justlamvt05.bookshop.service.impl;

import com.justlamvt05.bookshop.domain.dto.OrderDto;
import com.justlamvt05.bookshop.domain.dto.UpdateProfileRequest;
import com.justlamvt05.bookshop.domain.dto.UserProfileDto;
import com.justlamvt05.bookshop.domain.entity.User;
import com.justlamvt05.bookshop.domain.repository.OrderRepository;
import com.justlamvt05.bookshop.domain.repository.UserRepository;
import com.justlamvt05.bookshop.exception.EntityNotFoundException;
import com.justlamvt05.bookshop.mapper.OrderMapper;
import com.justlamvt05.bookshop.mapper.UserMapper;
import com.justlamvt05.bookshop.payload.response.ApiResponse;
import com.justlamvt05.bookshop.service.UserService;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class UserServiceImpl implements UserService {

    private final UserRepository userRepo;
    private final OrderRepository orderRepo;
    private final UserMapper userMapper;
    private final OrderMapper orderMapper;

    @Override
    public ApiResponse<UserProfileDto> getMyProfile(String userId) {

        User user = userRepo.findActiveById(userId)
                .orElseThrow(() -> new EntityNotFoundException("User not found"));

        return ApiResponse.success(userMapper.toProfileDto(user));
    }

    @Override
    public ApiResponse<UserProfileDto> updateMyProfile(String userId, UpdateProfileRequest request) {

        User user = userRepo.findActiveById(userId)
                .orElseThrow(() -> new EntityNotFoundException("User not found"));

        userMapper.updateProfile(user, request);
        userRepo.save(user);

        return ApiResponse.success(userMapper.toProfileDto(user));
    }

    @Override
    public ApiResponse<List<OrderDto>> getMyOrders(String userId) {

        List<OrderDto> orders = orderRepo.findByUser_UserId(userId)
                .stream()
                .map(orderMapper::toDto)
                .toList();

        return ApiResponse.success(orders);
    }
}


