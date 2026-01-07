package com.justlamvt05.bookshop.payload.request;

import com.justlamvt05.bookshop.domain.entity.constraint.ERole;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AdminUserRequestInsert {

    @NotBlank
    private String userName;

    @NotBlank
    private String password;

    @NotBlank
    private String email;

    @NotBlank
    private String phone;

    private String firstName;
    private String lastName;

    @NotNull
    private ERole role;
}
