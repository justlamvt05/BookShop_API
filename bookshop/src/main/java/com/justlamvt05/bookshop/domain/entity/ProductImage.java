package com.justlamvt05.bookshop.domain.entity;

import com.justlamvt05.bookshop.domain.entity.constraint.EStatus;
import jakarta.persistence.*;
import lombok.*;


@Entity
@Table(name = "TBL_PRODUCT_IMAGE")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProductImage {

    @Id
    @Column(name = "image_id", length = 50)
    private String imageId;

    @Column(name = "url")
    private String url;

    @Column(name = "is_main")
    private boolean isMain;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", length = 20)
    private EStatus status;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "product_id")
    private Product product;
}
