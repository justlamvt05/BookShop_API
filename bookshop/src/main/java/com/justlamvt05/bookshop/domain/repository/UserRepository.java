package com.justlamvt05.bookshop.domain.repository;

import com.justlamvt05.bookshop.domain.dto.UserDto;
import com.justlamvt05.bookshop.domain.entity.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.Optional;
@Repository
public interface UserRepository extends JpaRepository<User, String> {
    @Query("""
    SELECT new com.justlamvt05.bookshop.domain.dto.UserDto(
        u.userId,
        u.userName,
        u.firstName,
        u.lastName,
        u.dob,
        u.email,
        u.phone,
        u.address,
        u.status,
        new com.justlamvt05.bookshop.domain.dto.RoleDto(
            r.roleId,
            r.name,
            r.status
        )
    )
    FROM User u
    JOIN u.role r
""")
    Page<UserDto> findAllUserDto(Pageable pageable);

    Optional<User> findByUserName(String username);

    boolean existsByUserName(String userName);

    boolean existsByEmail(String email);

    boolean existsByPhone(String phone);
}
