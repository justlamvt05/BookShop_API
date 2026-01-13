package com.justlamvt05.bookshop.domain.repository;

import com.justlamvt05.bookshop.domain.dto.UserDto;
import com.justlamvt05.bookshop.domain.entity.User;
import com.justlamvt05.bookshop.domain.entity.constraint.EStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
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
    WHERE
    (:keyword IS NULL OR
        LOWER(u.email) LIKE LOWER(CONCAT('%', :keyword, '%')) OR
        LOWER(u.userName) LIKE LOWER(CONCAT('%', :keyword, '%'))
    )
    AND (:status IS NULL OR u.status = :status)
""")
    Page<UserDto> findAllUserDto(Pageable pageable, String keyword, EStatus status);

    Optional<User> findByUserName(String username);

    boolean existsByUserName(String userName);

    boolean existsByEmail(String email);

    boolean existsByPhone(String phone);

    @Query(value = "SELECT NEXT VALUE FOR SEQ_USER_ID", nativeQuery = true)
    Long getNextUserSeq();

    @Query("""
        SELECT u FROM User u
        WHERE u.userId = :userId
        AND u.status = 'ACTIVE'
    """)
    Optional<User> findActiveById(@Param("userId") String userId);
}
