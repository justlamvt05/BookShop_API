package com.justlamvt05.bookshop.service;

import com.justlamvt05.bookshop.payload.request.AdminUserRequest;
import com.justlamvt05.bookshop.payload.response.ApiResponse;
import jakarta.servlet.http.HttpServletResponse;

import java.io.IOException;

public interface AdminService {

    ApiResponse<?> getUsers(int page, int size, String sortBy, String direction);

    ApiResponse<?> addUser(AdminUserRequest request);

    ApiResponse<?> updateUser(String userId, AdminUserRequest request);

    ApiResponse<?> inactivateUser(String userId);

    void exportUsersToCsv(HttpServletResponse response) throws IOException;
}
