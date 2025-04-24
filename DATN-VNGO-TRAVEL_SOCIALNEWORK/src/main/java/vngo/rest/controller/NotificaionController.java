package vngo.rest.controller;

import java.util.List;

import org.hibernate.ResourceClosedException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;


import lombok.RequiredArgsConstructor;
import vngo.dto.AccountStatusDto;
import vngo.dto.ChatNotification;
import vngo.dto.LocationDto;
import vngo.dto.MessagesDto;
import vngo.dto.NotificationDto;
import vngo.entity.Account;
import vngo.exception.ResourceNotFoundException;
import vngo.repository.AccountRepository;
import vngo.service.AccountService;
import vngo.service.NotificationService;
import vngo.ultil.AccountStatus;
import vngo.ultil.CommunicationStatus;
import vngo.ultil.ConstUltil;
import vngo.ultil.NotificationType;

@CrossOrigin({"http://localhost:3000", "http://192.168.7.181:3000"})
@RestController
@Controller
@RequiredArgsConstructor
public class NotificaionController {
	
	private final SimpMessagingTemplate messagingTemplate;

	@Autowired
	NotificationService notificationService;
	
	@Autowired
	AccountRepository accountRepository;
	
	
	@MessageMapping("/user.Online")
	@SendTo("/topic/online")
	public AccountStatusDto OnLine(@Payload AccountStatusDto accountStatusDto) {
		Account account = accountRepository.findById(accountStatusDto.getAccountId()).orElseThrow(() -> new ResourceNotFoundException("không tìm thấy accoung"));
		account.setStatus(accountStatusDto.getStatus());
		accountRepository.save(account);
		return accountStatusDto;
	}
	
	@MessageMapping("/notification")
	public void processMessage(@Payload NotificationDto notificationDto) {
		
		Long id = notificationService.addNotification(notificationDto);

	    NotificationDto newNotification = new NotificationDto(
	    		id,
	    		notificationDto.getRecipient(),
	    		notificationDto.getSender(),
	    		notificationDto.getTagetId(),
	    		notificationDto.getNotificationType(),
	    		notificationDto.getStatus(), 
	    		notificationDto.getContent(),
	    		notificationDto.getThumNail(),
	    		notificationDto.getNameSender(), 
	    		notificationDto.getSentAt().formatted(ConstUltil.TIME_FORMATTER)
	    );

	    // Gửi thông báo qua WebSocket
	    messagingTemplate.convertAndSendToUser(
	        String.valueOf(
	        notificationDto.getRecipient()),
	        "/queue/notification",
	        newNotification
	    );
	}

	
	@GetMapping("/api/notifications")
	public ResponseEntity<List<NotificationDto>> getListNotification(@RequestParam("accountId") Long id){
		try {
			return ResponseEntity.ok(notificationService.getNotificationByRecipient(id)) ;
		} catch (Exception e) {
			return ResponseEntity.ofNullable(null);
		}
	}
	
	@DeleteMapping("/api/remove-notification")
	public ResponseEntity<Boolean> removeNotification(@RequestParam("notificationId") Long id) throws Exception{
		try {
			notificationService.removeNotificaion(id);
			return ResponseEntity.ok(true);
		} catch (Exception e) {
			throw new ResourceNotFoundException("");
		}
		
	}
	
	@DeleteMapping("/api/removeBySender")
	public ResponseEntity<Void> removeNotificationsBySender(@RequestParam("senderId") Long senderId, @RequestParam("recipientId") Long recipientId) {
	    notificationService.deleteNotificationsBySender(senderId, recipientId);
	    return ResponseEntity.noContent().build();
	}
	
	
	
	
	
	
	
	
	
}
