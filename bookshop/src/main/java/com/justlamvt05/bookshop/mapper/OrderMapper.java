package com.justlamvt05.bookshop.mapper;

import com.justlamvt05.bookshop.domain.dto.OrderDto;
import com.justlamvt05.bookshop.domain.entity.Order;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import java.util.List;

@Mapper(componentModel = "spring", uses = OrderItemMapper.class)
public interface OrderMapper {


    @Mapping(target = "items", source = "orderItems")
    @Mapping(
            target = "itemsCount",
            expression = "java(order.getOrderItems().size())"
    )
    OrderDto toDto(Order order);


    List<OrderDto> toDtoList(List<Order> orders);
}
