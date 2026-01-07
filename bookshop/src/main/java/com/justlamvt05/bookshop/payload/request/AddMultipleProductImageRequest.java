package com.justlamvt05.bookshop.payload.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import lombok.*;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AddMultipleProductImageRequest {

    @NotEmpty(message = "Image URL list cannot be empty")
    private List<@NotBlank(message = "Image URL cannot be blank") String> urls;
}
