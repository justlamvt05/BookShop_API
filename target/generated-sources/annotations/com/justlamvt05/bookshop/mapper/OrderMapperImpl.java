package com.justlamvt05.bookshop.mapper;

import com.justlamvt05.bookshop.domain.dto.OrderDto;
import com.justlamvt05.bookshop.domain.entity.Order;
import javax.annotation.processing.Generated;
import org.springframework.stereotype.Component;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    date = "2026-01-07T17:00:27+0700",
    comments = "version: 1.6.3, compiler: javac, environment: Java 21.0.7 (Oracle Corporation)"
)
@Component
public class OrderMapperImpl implements OrderMapper {

    @Override
    public OrderDto toDto(Order order) {
        if ( order == null ) {
            return null;
        }

        OrderDto orderDto = new OrderDto();

        orderDto.setOrderId( order.getOrderId() );
        orderDto.setTotalAmount( order.getTotalAmount() );
        if ( order.getPaymentStatus() != null ) {
            orderDto.setPaymentStatus( order.getPaymentStatus().name() );
        }
        orderDto.setQrCodeUrl( order.getQrCodeUrl() );
        orderDto.setCreatedAt( order.getCreatedAt() );

        return orderDto;
    }
}
