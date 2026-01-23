package com.justlamvt05.bookshop.domain.dto;

public interface ProductView {

    String getProductId();
    String getName();
    String getDescription();
    Double getPrice();
    Integer getQuantity();
    String getCategoryName();
    String getImageUrl();
}
