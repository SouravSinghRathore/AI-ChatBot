package com.backend.springboot.model;

import java.time.LocalDateTime;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;

@Entity
public class ChatMessage {
    @Id
    @GeneratedValue(strategy= GenerationType.AUTO)
    private Long id;

    private String prompt;
    private String response;
    private LocalDateTime timestamp;
    
    public ChatMessage() {
    }

    public ChatMessage(String prompt, String response, LocalDateTime timestamp) {
        this.prompt = prompt;
        this.response = response;
        this.timestamp = timestamp;
    }

    public Long getId() {
        return id;
    }

    public String getPrompt() {
        return prompt;
    }

    public void setPrompt(String prompt) {
        this.prompt = prompt;
    }

    public String getResponse() {
        return response;
    }

    public void setResponse(String response) {
        this.response = response;
    }

    public LocalDateTime getTimestamp() {
        return timestamp;
    }

    public void setTimestamp(LocalDateTime timestamp) {
        this.timestamp = timestamp;
    }
}
