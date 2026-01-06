package com.justlamvt05.bookshop.mapper;

import com.justlamvt05.bookshop.domain.dto.RoleDto;
import com.justlamvt05.bookshop.domain.entity.Role;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface RoleMapper {

    RoleDto toDto(Role role);
}