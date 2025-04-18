package com.backend.springboot.service;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;

import com.backend.springboot.dto.ChatRequest;
import com.backend.springboot.dto.ChatResponse;
import com.backend.springboot.dto.PromptRequest;
import com.backend.springboot.model.ChatMessage;
import com.backend.springboot.repository.ChatRepository;

@Service
public class ChatService {
    
    private final RestClient restClient;
    private final ChatRepository chatRepo;

    public ChatService(RestClient restClient, ChatRepository chatRepo){
        this.restClient = restClient;
        this.chatRepo = chatRepo;
    }

    @Value("${openai.api.key}")
    private String apiKey;

    @Value("${openai.api.model}")
    private String model;

    @SuppressWarnings("null")
    public String getResponse(PromptRequest PromptRequest){

        ChatRequest chatRequest = new ChatRequest(model, 
        List.of(new ChatRequest
        .Message("user", PromptRequest.prompt())));

        ChatResponse response = restClient.post()
            .header("Authorization", "Bearer " + apiKey)
            .header("Content-Type", "application/json")
            .body(chatRequest)
            .retrieve()
            .body(ChatResponse.class);
            
        String botReply = response.choices().get(0).message().content();

        // save to database
        ChatMessage chat = new ChatMessage();
        chat.setPrompt(PromptRequest.prompt());
        chat.setResponse(botReply);
        chat.setTimestamp(LocalDateTime.now());
        chatRepo.save(chat);
        

        return botReply;
    }
}
