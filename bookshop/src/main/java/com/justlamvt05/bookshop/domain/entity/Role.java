package com.justlamvt05.bookshop.domain.entity;


import com.justlamvt05.bookshop.domain.entity.constraint.ERole;
import com.justlamvt05.bookshop.domain.entity.constraint.EStatus;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.util.HashSet;
import java.util.Set;

@Entity
@Getter
@Setter
@Table(name = "TBL_ROLE")
public class Role {

    @Id
    @Column(name = "role_id", columnDefinition = "nvarchar(50)")
    private String roleId;

    @Enumerated(EnumType.STRING)
    @Column(length = 20)
    private ERole name;

    @Enumerated(EnumType.STRING)
    @Column(length = 20)
    private EStatus status;

    @OneToMany(mappedBy = "role", fetch = FetchType.LAZY)
    private Set<User> users = new HashSet<>();
}
