package com.justlamvt05.bookshop.payload.response;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.justlamvt05.bookshop.domain.dto.RoleDto;
import lombok.*;

import java.util.Set;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@Builder
@JsonIgnoreProperties(ignoreUnknown = true)
public class JwtResponse {
    private String token;
    private String type = "Bearer";
    private String username;
    private String roles;

}