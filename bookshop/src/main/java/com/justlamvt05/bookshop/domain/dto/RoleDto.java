package com.justlamvt05.bookshop.domain.dto;

import com.justlamvt05.bookshop.domain.entity.constraint.ERole;
import com.justlamvt05.bookshop.domain.entity.constraint.EStatus;
import lombok.*;


@Builder
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class RoleDto {

    private String roleId;
    private ERole name;
    private EStatus status;
}