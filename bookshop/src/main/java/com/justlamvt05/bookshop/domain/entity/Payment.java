package com.justlamvt05.bookshop.domain.entity;

import com.justlamvt05.bookshop.domain.entity.constraint.EPaymentStatus;
import jakarta.persistence.*;
import lombok.*;
import org.springframework.data.annotation.CreatedDate;

import java.time.LocalDateTime;

@Entity
@Table(name = "TBL_PAYMENT")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Payment {

    @Id
    @Column(name = "payment_id")
    private String paymentId;

    private String qrCodeUrl;

    @Enumerated(EnumType.STRING)
    private EPaymentStatus status;

    private LocalDateTime createdAt;

    @OneToOne
    @JoinColumn(name = "order_id")
    private Order order;
}
