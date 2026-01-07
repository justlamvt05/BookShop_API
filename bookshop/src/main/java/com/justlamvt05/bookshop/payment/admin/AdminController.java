package com.justlamvt05.bookshop.payment.admin;


import com.justlamvt05.bookshop.payload.request.AdminUserRequestInsert;
import com.justlamvt05.bookshop.payload.request.AdminUserRequestUpdate;
import com.justlamvt05.bookshop.payload.response.ApiResponse;
import com.justlamvt05.bookshop.service.AdminService;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;

@RestController
@Slf4j
@RequestMapping("/admin")
@RequiredArgsConstructor
public class AdminController {
    private final AdminService adminService;
    @GetMapping("/users")
    public ResponseEntity<ApiResponse<?>> getUsers(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "userName") String sortBy,
            @RequestParam(defaultValue = "asc") String direction,
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) String status
    ) {
        return ResponseEntity.ok(
                adminService.getUsers(page, size, sortBy, direction, keyword, status)
        );
    }

    @GetMapping("/users/{id}")
    public ResponseEntity<ApiResponse<?>> getUserDetail(@PathVariable String id) {
        return ResponseEntity.ok(
                adminService.findUser(id)
        );
    }
    @PostMapping("/users")
    public ResponseEntity<ApiResponse<?>> addUser(
            @Valid @RequestBody AdminUserRequestInsert request
    ) {
        return ResponseEntity.ok(adminService.addUser(request));
    }

    @PutMapping("/users/{id}")
    public ResponseEntity<ApiResponse<?>> updateUser(
            @PathVariable String id,
            @Valid @RequestBody AdminUserRequestUpdate request
    ) {
        return ResponseEntity.ok(adminService.updateUser(id, request));
    }

    @PatchMapping("/users/{id}/toggle")
    public ResponseEntity<ApiResponse<?>> toggleUser(@PathVariable String id) {
        return ResponseEntity.ok(adminService.toggleUser(id));
    }

    @GetMapping("/users/export")
    public void exportCsv(HttpServletResponse response) throws IOException {
        adminService.exportUsersToCsv(response);
    }
}
