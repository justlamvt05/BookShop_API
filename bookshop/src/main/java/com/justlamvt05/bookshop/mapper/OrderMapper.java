package com.justlamvt05.bookshop.mapper;

import com.justlamvt05.bookshop.domain.dto.OrderDto;
import com.justlamvt05.bookshop.domain.entity.Order;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface OrderMapper {

    OrderDto toDto(Order order);
}
