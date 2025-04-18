package com.backend.springboot.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.backend.springboot.model.ChatMessage;

public interface ChatRepository extends JpaRepository<ChatMessage, Long> {

}
