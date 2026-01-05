package com.justlamvt05.bookshop.payment.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class test {
    @GetMapping("/all")
    public String allAccess() {
        return "Public Content.";
    }

}
