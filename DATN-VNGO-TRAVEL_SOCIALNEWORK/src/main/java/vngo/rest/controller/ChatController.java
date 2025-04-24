package vngo.rest.controller;

import java.util.Collections;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.repository.query.Param;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;

import lombok.RequiredArgsConstructor;
import vngo.dto.ChatNotification;
import vngo.dto.MessagesDto;
import vngo.exception.ResourceNotFoundException;
import vngo.service.AccountService;
import vngo.service.MessageService;

@Controller
@RequiredArgsConstructor
public class ChatController {
	private final SimpMessagingTemplate messagingTemplate;

	@Autowired
	AccountService accountService;

	@Autowired
	MessageService messageService;

	@MessageMapping("/chat")
	public void processMessage(@Payload MessagesDto messDto) {
		messageService.addMessages(messDto);
		messagingTemplate.convertAndSendToUser(String.valueOf(messDto.getRecipientId()), "/queue/messages",
				new ChatNotification(messDto.getId(), messDto.getSenderId(), messDto.getRecipientId(),
						messDto.getContent()));
	}

	@GetMapping("/messages/{senderId}/{recipientId}")
	public ResponseEntity<List<MessagesDto>> findMessage(@PathVariable("senderId") Long senderid,
			@PathVariable("recipientId") Long recipientId) {
		try {
			List<MessagesDto> listMessage = messageService.findMessages(senderid, recipientId);
			return ResponseEntity.ok(listMessage);
		} catch (ResourceNotFoundException e) {
			return ResponseEntity.ok(Collections.emptyList());
		}
	}

	@GetMapping("/api/latest-message/{senderId}/{recipientId}")
	public ResponseEntity<MessagesDto> findChatMessages(@PathVariable("senderId") Long senderid,
			@PathVariable("recipientId") Long recipientId) {
		try {
			MessagesDto messagesDto = messageService.findLastMessages(senderid, recipientId);
			return ResponseEntity.ok(messagesDto);
		} catch (ResourceNotFoundException e) {
			return ResponseEntity.notFound().build();
		}
	}

	@PutMapping("/api/messages-status/{senderId}/{recipientId}")
	public ResponseEntity<List<MessagesDto>> updaStatus	(@PathVariable("senderId") Long senderid,
			@PathVariable("recipientId") Long recipientId) {
		try {
			messageService.updateStatusMessage(senderid, recipientId);
			return ResponseEntity.ok().build();
		} catch (ResourceNotFoundException e) {
			return ResponseEntity.ok(Collections.emptyList());
		}
	}

	@GetMapping("/api/count-unread/{senderId}/{recipientId}")
	public ResponseEntity<Long> countUnreadMessage(@PathVariable("senderId") Long senderid,
			@PathVariable("recipientId") Long recipientId) {
		Long count = messageService.countUnreadMessages(senderid, recipientId);
		return ResponseEntity.ok(count);
	}
	
	@GetMapping("/api/count-all-unread/{recipientId}")
	public ResponseEntity<Long> countAllUnreadMessage(
			@PathVariable("recipientId") Long recipientId) {
		Long count = messageService.countAllUnreadMessages(recipientId);
		return ResponseEntity.ok(count);
	}


	@PutMapping("/api/message/delete")
	public ResponseEntity<Boolean> deleteContact(
			@RequestParam("senderId") Long senderId,
			@RequestParam("recipientId") Long recipientId) {
	        System.out.println("Sender ID: " + senderId + ", Recipient ID: " + recipientId);
	        messageService.deleteMessage(senderId, recipientId);
	        return ResponseEntity.ok(true);
	    
	}

}
