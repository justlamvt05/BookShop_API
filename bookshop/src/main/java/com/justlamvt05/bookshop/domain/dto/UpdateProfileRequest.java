package com.justlamvt05.bookshop.domain.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

@Getter
@Setter
public class UpdateProfileRequest {

    @NotBlank
    private String phone;
    private String firstName;
    private String lastName;
    private LocalDate dob;
    private String address;
    private String password;
}
