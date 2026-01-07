package com.justlamvt05.bookshop.domain.entity;

import com.justlamvt05.bookshop.domain.entity.constraint.EStatus;
import jakarta.persistence.*;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
@Table(name = "TBL_CATEGORY")
public class Category {

    @Id
    @Column(
        name = "category_id",
        columnDefinition = "nvarchar(50)"
    )
    private String categoryId;

    @Column(
        name = "name",
        columnDefinition = "nvarchar(100)",
        nullable = false
    )
    private String name;

    @Enumerated(EnumType.STRING)
    @Column(
        name = "status",
        columnDefinition = "nvarchar(20)",
        nullable = false
    )
    private EStatus status;
}
