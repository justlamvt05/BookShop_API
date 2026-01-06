package com.justlamvt05.bookshop.domain.dto;

import com.justlamvt05.bookshop.domain.entity.constraint.EStatus;
import lombok.*;

import java.time.LocalDate;
import java.util.Set;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Builder
public class UserDto {

    private String userId;
    private String userName;
    private String firstName;
    private String lastName;
    private LocalDate dob;
    private String email;
    private String phone;
    private String address;
    private EStatus status;
    private RoleDto role;
}
