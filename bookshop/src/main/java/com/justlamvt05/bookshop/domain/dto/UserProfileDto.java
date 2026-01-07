package com.justlamvt05.bookshop.domain.dto;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

@Getter
@Setter
public class UserProfileDto {

    private String userName;
    private String email;
    private String phone;
    private String firstName;
    private String lastName;
    private LocalDate dob;
    private String address;
}
