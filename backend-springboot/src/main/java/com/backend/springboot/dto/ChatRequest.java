package com.backend.springboot.dto;

import java.util.List;

public record ChatRequest(String model, List<Message> messages) {
    public record Message(String role, String content){

    }
} 
