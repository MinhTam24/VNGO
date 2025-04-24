package vngo.impl;

import java.sql.Date;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.Optional;

import org.apache.logging.log4j.message.Message;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import jakarta.transaction.Transactional;
import vngo.dto.MessagesDto;
import vngo.entity.Account;
import vngo.entity.Messages;
import vngo.exception.ResourceNotFoundException;
import vngo.repository.AccountRepository;
import vngo.repository.MessagesRepository;
import vngo.security.Auth;
import vngo.service.MessageService;
import vngo.ultil.CommunicationStatus;
import vngo.ultil.ConstUltil;

@Service
public class MessageImpl implements MessageService {
	@Autowired
	AccountRepository accountRepository;
	@Autowired
	MessagesRepository messagesRepository;
	@Autowired
	Auth auth;

	@Override
	public List<MessagesDto> findMessages(Long senderId, Long recipientId) {
		Account senderAccount = accountRepository.findById(auth.getUserId())
				.orElseThrow(() -> new IllegalArgumentException("Sender not found"));
		Account recipientAccount = accountRepository.findById(recipientId)

				.orElseThrow(() -> new IllegalArgumentException("Recipient not found"));

		List<Messages> listMessagesSend = messagesRepository.findBySenderAndRecipientAndSenderStatusTrue(senderAccount, recipientAccount);
		List<Messages> listMessagesRecive = messagesRepository.findBySenderAndRecipientAndRecipientStatusTrue(recipientAccount,senderAccount);

		if (listMessagesSend.isEmpty() && listMessagesRecive.isEmpty()) {
			throw new ResourceNotFoundException("NO MESSAGE");
		}

		List<Messages> allMessage = new ArrayList<>();
		allMessage.addAll(listMessagesSend);
		allMessage.addAll(listMessagesRecive);

		allMessage.sort((m1, m2) -> m1.getSentAt().compareTo(m2.getSentAt()));

		List<MessagesDto> listMessageDto = allMessage.stream()
				.map(message -> MessagesDto.builder().id(message.getId()).senderId(message.getSender().getId())
						.recipientId(message.getRecipient().getId()).content(message.getContent())
						.sentAt(message.getSentAt().format(ConstUltil.DATE_TIME_FORMATTER)).build())
				.toList();

		return listMessageDto;
	}

	public void updateStatusMessage(Long senderId, Long recipientId) {
		System.out.println("SENDERID" + senderId + "recipientId" + recipientId);
		Account senderAccount = accountRepository.findById(senderId)
				.orElseThrow(() -> new IllegalArgumentException("Sender not found"));
		Account recipientAccount = accountRepository.findById(recipientId)
				.orElseThrow(() -> new IllegalArgumentException("Recipient not found"));
		List<Messages> listMessagesSend = messagesRepository.findBySenderIdAndRecipientIdAndStatus(senderId,
				recipientId, CommunicationStatus.SENT);
		if (!listMessagesSend.isEmpty()) {
			for (Messages message : listMessagesSend) {
				if (message.getStatus() == CommunicationStatus.SENT) {
					message.setStatus(CommunicationStatus.READ);
					messagesRepository.save(message);
				}
			}
		}
		throw new ResourceNotFoundException("không có tin nhắn mới");
	}

	@Override
	public MessagesDto addMessages(MessagesDto messageDto) {
		Optional<Account> sender = accountRepository.findById(messageDto.getSenderId());
		Optional<Account> recipient = accountRepository.findById(messageDto.getRecipientId());
		Messages message = Messages.builder().id(
				messageDto.getId())
				.sentAt(LocalDateTime.now().truncatedTo(ChronoUnit.SECONDS))
				.sender(sender.get())
				.recipient(recipient.get())
				.content(messageDto.getContent())
				.status(messageDto.getStatus())
				.senderStatus(true)
				.recipientStatus(true)
				.build();
		messagesRepository.save(message);
		return messageDto;
	}

	@Override
	public MessagesDto findLastMessages(Long senderId, Long recipientId) {
		Pageable pageable = PageRequest.of(0, 1);
		List<Messages> messageList = messagesRepository.findLastMessage(senderId, recipientId, pageable);
		if (!messageList.isEmpty()) {
			Messages message = messageList.get(0);
			MessagesDto Lastmessage = MessagesDto.builder().id(message.getId()).senderId(message.getSender().getId())
					.recipientId(message.getRecipient().getId()).content(message.getContent())
					.sentAt(message.getSentAt().format(ConstUltil.DATE_TIME_FORMATTER)).build();
			return Lastmessage;
		}
		return null;
	}

	@Override
	public long countUnreadMessages(Long senderId, Long recipientId) {
		long count = messagesRepository.countUnreadMessages(senderId, recipientId, CommunicationStatus.SENT);
		return count;
	}
	
	@Override
	public long countAllUnreadMessages(Long recipientId) {
		long count = messagesRepository.countAllUnreadMessages(recipientId, CommunicationStatus.SENT);
		return count;
	}
	
	public void deleteMessage(Long senderid, Long recipientId) {
		List<Messages> messageSend = messagesRepository.findBySenderIdAndRecipientId(senderid, recipientId);
		List<Messages> messageRecived = messagesRepository.findBySenderIdAndRecipientId(recipientId, senderid);
		
		if(messageSend.isEmpty() && messageRecived.isEmpty()) {
			throw new ResourceNotFoundException("Không có tin nhắn để xóa");
		}
		
		messagesRepository.updateStatuses(senderid, recipientId);
	}

}
