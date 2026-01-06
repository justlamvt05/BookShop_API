package com.justlamvt05.bookshop.mapper;

import com.justlamvt05.bookshop.domain.dto.UserDto;
import com.justlamvt05.bookshop.domain.entity.User;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(
        componentModel = "spring",
        uses = {RoleMapper.class}
)
public interface UserMapper {
    @Mapping(source = "role", target = "role")
    UserDto toDto(User user);
}
