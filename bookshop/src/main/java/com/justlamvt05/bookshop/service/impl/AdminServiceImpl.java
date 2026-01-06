package com.justlamvt05.bookshop.service.impl;

import com.justlamvt05.bookshop.domain.dto.UserDto;
import com.justlamvt05.bookshop.domain.entity.Role;
import com.justlamvt05.bookshop.domain.entity.User;
import com.justlamvt05.bookshop.domain.entity.constraint.EStatus;
import com.justlamvt05.bookshop.domain.repository.RoleRepository;
import com.justlamvt05.bookshop.domain.repository.UserRepository;
import com.justlamvt05.bookshop.payload.request.AdminUserRequest;
import com.justlamvt05.bookshop.payload.response.ApiResponse;
import com.justlamvt05.bookshop.service.AdminService;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.io.PrintWriter;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Transactional
public class AdminServiceImpl implements AdminService {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public ApiResponse<?> getUsers(int page, int size, String sortBy, String direction) {

        Sort sort = direction.equalsIgnoreCase("desc")
                ? Sort.by(sortBy).descending()
                : Sort.by(sortBy).ascending();

        Pageable pageable = PageRequest.of(page, size, sort);

        Page<UserDto> users = userRepository.findAllUserDto(pageable);

        return ApiResponse.success(users);
    }

    @Override
    public ApiResponse<?> addUser(AdminUserRequest request) {

        if (userRepository.existsByUserName(request.getUserName())) {
            throw new IllegalArgumentException("Username already exists");
        }

        Role role = roleRepository.findByName(request.getRole())
                .orElseThrow(() -> new RuntimeException("Role not found"));

        User user = User.builder()
                .userId(UUID.randomUUID().toString())
                .userName(request.getUserName())
                .password(passwordEncoder.encode(request.getPassword()))
                .email(request.getEmail())
                .phone(request.getPhone())
                .firstName(request.getFirstName())
                .lastName(request.getLastName())
                .status(EStatus.ACTIVE)
                .role(role)
                .build();

        userRepository.save(user);

        return ApiResponse.success("User created successfully");
    }

    @Override
    public ApiResponse<?> updateUser(String userId, AdminUserRequest request) {

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Role role = roleRepository.findByName(request.getRole())
                .orElseThrow(() -> new RuntimeException("Role not found"));

        user.setEmail(request.getEmail());
        user.setPhone(request.getPhone());
        user.setFirstName(request.getFirstName());
        user.setLastName(request.getLastName());
        user.setRole(role);

        userRepository.save(user);

        return ApiResponse.success("User updated successfully");
    }

    @Override
    public ApiResponse<?> inactivateUser(String userId) {

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        user.setStatus(EStatus.INACTIVE);
        userRepository.save(user);

        return ApiResponse.success("User inactivated successfully");
    }

    @Override
    public void exportUsersToCsv(HttpServletResponse response) throws IOException {

        response.setContentType("text/csv");
        response.setHeader(
                "Content-Disposition",
                "attachment; filename=users.csv"
        );

        List<User> users = userRepository.findAll();

        PrintWriter writer = response.getWriter();
        writer.println("UserId,Username,Email,Phone,Role,Status");

        for (User u : users) {
            writer.printf(
                    "%s,%s,%s,%s,%s,%s%n",
                    u.getUserId(),
                    u.getUserName(),
                    u.getEmail(),
                    u.getPhone(),
                    u.getRole().getName(),
                    u.getStatus()
            );
        }

        writer.flush();
    }
}
