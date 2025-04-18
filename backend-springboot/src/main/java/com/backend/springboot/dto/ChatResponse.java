package com.backend.springboot.dto;

import java.util.List;

public record ChatResponse(List<Choices> choices) {
    public record Choices(Message message){
        public record Message(String role, String content){

        }
    }
}
