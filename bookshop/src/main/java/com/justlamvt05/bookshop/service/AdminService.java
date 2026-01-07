package com.justlamvt05.bookshop.service;

import com.justlamvt05.bookshop.payload.request.AdminUserRequestInsert;
import com.justlamvt05.bookshop.payload.request.AdminUserRequestUpdate;
import com.justlamvt05.bookshop.payload.response.ApiResponse;
import jakarta.servlet.http.HttpServletResponse;

import java.io.IOException;

public interface AdminService {

    ApiResponse<?> getUsers(int page, int size, String sortBy, String direction, String keyword, String status);

    ApiResponse<?> addUser(AdminUserRequestInsert request);

    ApiResponse<?> updateUser(String userId, AdminUserRequestUpdate request);

    ApiResponse<?> findUser(String userId);

    ApiResponse<?> toggleUser(String userId);

    void exportUsersToCsv(HttpServletResponse response) throws IOException;
}
