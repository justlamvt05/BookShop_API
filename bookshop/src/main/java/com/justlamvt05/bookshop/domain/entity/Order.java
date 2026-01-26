package com.justlamvt05.bookshop.domain.entity;

import com.justlamvt05.bookshop.domain.entity.constraint.EPaymentStatus;
import jakarta.persistence.*;

import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "TBL_ORDER")
@Getter @Setter
public class Order {

    @Id
    @Column(name = "order_id", length = 50)
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long orderId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;


    @Enumerated(EnumType.STRING)
    @Column(name = "payment_status", length = 20, nullable = false)
    private EPaymentStatus paymentStatus;


    @Column(name = "total_amount", precision = 18, scale = 2, nullable = false)
    private BigDecimal totalAmount;


    @Column(name = "qr_code_url", length = 255)
    private String qrCodeUrl;


    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;

    @OneToMany(
            mappedBy = "order",
            cascade = CascadeType.ALL,
            orphanRemoval = true,
            fetch = FetchType.LAZY
    )
    private Set<OrderItem> orderItems = new HashSet<>();
}

