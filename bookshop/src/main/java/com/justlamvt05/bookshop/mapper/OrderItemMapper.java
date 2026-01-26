package com.justlamvt05.bookshop.mapper;

import com.justlamvt05.bookshop.domain.dto.OrderItemDto;
import com.justlamvt05.bookshop.domain.entity.OrderItem;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import java.util.Set;

@Mapper(componentModel = "spring")
public interface OrderItemMapper {

    @Mapping(source = "product.productId", target = "productId")
    @Mapping(source = "product.name", target = "productName")
    OrderItemDto toDto(OrderItem entity);

    Set<OrderItemDto> toDtoSet(Set<OrderItem> entities);
}