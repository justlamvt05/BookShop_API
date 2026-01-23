package com.justlamvt05.bookshop.domain.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.justlamvt05.bookshop.domain.entity.constraint.EStatus;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.util.HashSet;
import java.util.Set;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
@Table(name = "TBL_USER")
public class User {
        @Id
        @Column(name = "user_id", columnDefinition = "nvarchar(50)")
        private String userId;

        @Column(name = "user_name", columnDefinition = "nvarchar(50)", nullable = false, unique = true)
        private String userName;

        @Column(name = "first_name", columnDefinition = "nvarchar(100)", nullable = false)
        private String firstName;

        @Column(name = "last_name", columnDefinition = "nvarchar(100)")
        private String lastName;

        @Column(name = "DOB")
        private LocalDate dob;

        @Column(name = "password", columnDefinition = "nvarchar(255)", nullable = false)
        private String password;

        @Column(name = "email", columnDefinition = "nvarchar(150)", unique = true, nullable = false)
        private String email;

        @Column(name = "phone", columnDefinition = "nvarchar(20)", unique = true, nullable = false)
        private String phone;

        @Column(name = "address", columnDefinition = "nvarchar(255)")
        private String address;

        @Enumerated(EnumType.STRING)
        @Column(length = 20)
        private EStatus status;

        @JsonIgnore
        @ManyToOne
        @JoinColumn(name = "role_id", nullable = false)
        private Role role;

}
