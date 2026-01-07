package com.justlamvt05.bookshop.mapper;

import com.justlamvt05.bookshop.domain.dto.UpdateProfileRequest;
import com.justlamvt05.bookshop.domain.dto.UserDto;
import com.justlamvt05.bookshop.domain.dto.UserProfileDto;
import com.justlamvt05.bookshop.domain.entity.User;
import org.mapstruct.*;

@Mapper(
        componentModel = "spring",
        uses = {RoleMapper.class}
)
public interface UserMapper {
    @Mapping(source = "role", target = "role")
    UserDto toDto(User user);

    UserProfileDto toProfileDto(User user);

    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    void updateProfile(@MappingTarget User user, UpdateProfileRequest request);
}
