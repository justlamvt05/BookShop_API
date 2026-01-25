package com.justlamvt05.bookshop.domain.entity;

import com.justlamvt05.bookshop.domain.entity.constraint.EStatus;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

@Getter
@Setter
@Entity
@Table(name = "TBL_USER")
public class User {
        @Id
        @Column(name = "user_id", columnDefinition = "nvarchar(50)")
        private String userId;

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


}
