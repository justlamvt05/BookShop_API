package com.justlamvt05.bookshop.service.impl;

import com.justlamvt05.bookshop.domain.dto.UserDto;
import com.justlamvt05.bookshop.domain.entity.Role;
import com.justlamvt05.bookshop.domain.entity.User;
import com.justlamvt05.bookshop.domain.entity.constraint.ERole;
import com.justlamvt05.bookshop.domain.entity.constraint.EStatus;
import com.justlamvt05.bookshop.domain.repository.RoleRepository;
import com.justlamvt05.bookshop.domain.repository.UserRepository;
import com.justlamvt05.bookshop.exception.InvalidInputException;
import com.justlamvt05.bookshop.exception.UnauthorizedException;
import com.justlamvt05.bookshop.mapper.UserMapper;
import com.justlamvt05.bookshop.payload.request.RegisterRequest;
import com.justlamvt05.bookshop.payload.response.ApiResponse;
import com.justlamvt05.bookshop.service.AuthService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class AuthServiceImpl implements AuthService {
    private final UserRepository userRepository;
    private final UserMapper userMapper;
    private final PasswordEncoder passwordEncoder;
    private final RoleRepository roleRepository;
    @Override
    public UserDto login(String username, String password) {
        User optionalUser = userRepository.findByUserName(username).orElseThrow(
                () -> new UnauthorizedException("Invalid username or password.")
        );
        if (!passwordEncoder.matches(password, optionalUser.getPassword())) {
            throw new UnauthorizedException("Invalid username or password.");
        }
        if (!optionalUser.getStatus().name().equals("ACTIVE")) {
            throw new UnauthorizedException("This user is inactive.");
        }
        return userMapper.toDto(optionalUser);
    }

    @Override
    public ApiResponse<?> register(RegisterRequest request) {
        validateRegisterRequest(request);

        Role role = roleRepository.findByName(ERole.ROLE_CUSTOMER)
                .orElseThrow(() ->
                        new RuntimeException("Default role ROLE_CUSTOMER not found")
                );
        String id = generateUserId();
        /* ========= Create User ========= */
        User user = User.builder()
                .userId(id)
                .userName(request.getUsername())
                .password(passwordEncoder.encode(request.getPassword()))
                .email(request.getEmail())
                .firstName(request.getFirstName())
                .lastName(request.getLastName())
                .phone(request.getPhoneNumber())
                .address(request.getAddress())
                .status(EStatus.ACTIVE)
                .role(role)
                .build();

        userRepository.save(user);

        return ApiResponse.success("Register successfully");
    }
    private String generateUserId() {
        Long nextVal = userRepository.getNextUserSeq();
        return String.format("U%05d", nextVal);
    }
    private void validateRegisterRequest(RegisterRequest request) {

        if (!request.getPassword().equals(request.getConfirmPassword())) {
            throw new InvalidInputException("Password and Confirm Password do not match");
        }

        if (userRepository.existsByUserName(request.getUsername())) {
            throw new InvalidInputException("Username already exists");
        }

        if (userRepository.existsByEmail(request.getEmail())) {
            throw new InvalidInputException("Email already exists");
        }

        if (userRepository.existsByPhone(request.getPhoneNumber())) {
            throw new InvalidInputException("Phone number already exists");
        }
    }
}


