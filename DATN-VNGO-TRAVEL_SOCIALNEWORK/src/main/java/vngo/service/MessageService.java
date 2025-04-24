package vngo.service;

import java.util.List;

import org.springframework.stereotype.Service;

import vngo.dto.MessagesDto;
import vngo.entity.Account;

@Service
public interface MessageService {
		
		List<MessagesDto> findMessages(Long senderId, Long recipientId);
		MessagesDto addMessages(MessagesDto messageDto);
		MessagesDto findLastMessages(Long senderId, Long recipientId);
		void updateStatusMessage(Long senderId, Long recipientId);
		public long countUnreadMessages(Long senderId, Long recipientId);
		void deleteMessage(Long senderid, Long recipientId);
		long countAllUnreadMessages(Long recipientId);
}