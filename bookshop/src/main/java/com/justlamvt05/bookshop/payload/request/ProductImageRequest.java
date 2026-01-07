package com.justlamvt05.bookshop.payload.request;

import jakarta.validation.constraints.NotBlank;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProductImageRequest {

    @NotBlank(message = "Image URL cannot be empty")
    private String url;
}
