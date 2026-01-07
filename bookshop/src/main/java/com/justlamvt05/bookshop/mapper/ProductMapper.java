package com.justlamvt05.bookshop.mapper;

import com.justlamvt05.bookshop.domain.dto.ProductDto;
import com.justlamvt05.bookshop.domain.entity.Product;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import java.util.List;

@Mapper(componentModel = "spring")
public interface ProductMapper {

    @Mapping(source = "category.name", target = "categoryName")
    ProductDto toDto(Product product);

    List<ProductDto> toDtoList(List<Product> products);
}
