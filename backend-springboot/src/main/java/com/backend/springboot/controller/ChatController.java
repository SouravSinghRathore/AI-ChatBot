package com.backend.springboot.controller;

import java.util.List;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.backend.springboot.dto.PromptRequest;
import com.backend.springboot.model.ChatMessage;
import com.backend.springboot.repository.ChatRepository;
import com.backend.springboot.service.ChatService;

@CrossOrigin("*")
@RestController
@RequestMapping("/api/chat")
public class ChatController {
    
    private final ChatService chatService;
    private final ChatRepository chatRepo;

    public ChatController(ChatService chatService, ChatRepository chatRepo){
        this.chatService = chatService;
        this.chatRepo = chatRepo;
    }

    @PostMapping
    public String chat(@RequestBody PromptRequest promptRequest){
        return chatService.getResponse(promptRequest);
    }

    @GetMapping
    public List<ChatMessage> getAllChats(){
        return chatRepo.findAll();
    }
}
