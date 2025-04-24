package vngo.impl;

import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.Collections;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.convert.DtoInstantiatingConverter;
import org.springframework.stereotype.Service;


import vngo.dto.NotificationDto;
import vngo.entity.Account;
import vngo.entity.Notification;
import vngo.exception.ResourceNotFoundException;
import vngo.repository.AccountRepository;
import vngo.repository.NotificationRepository;
import vngo.service.AccountService;
import vngo.service.ImageService;
import vngo.service.NotificationService;
import vngo.ultil.CommunicationStatus;
import vngo.ultil.ConstUltil;
import vngo.ultil.NotificationType;

@Service
public class NotificationServicelmpl implements NotificationService { 

    @Autowired
    private NotificationRepository notificationRepository;

    @Autowired
    private AccountRepository accountRepository;

    @Autowired
    private ImageService imageService;

    @Autowired
    private AccountServiceImpl accountService;

    public Long addNotification(NotificationDto notificationDto) {
        Account sender = accountRepository.findById(notificationDto.getSender())
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy sender: " + notificationDto.getSender()));
        
        Account recipient = accountRepository.findById(notificationDto.getRecipient())
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy recipient: " + notificationDto.getRecipient()));
        
        if (sender.isActivated() && recipient.isActivated()) {
            Notification notification = Notification.builder()
                    .tagetId(notificationDto.getTagetId()) 
                    .status(CommunicationStatus.SENT)
                    .content(notificationDto.getContent())
                    .notificationType(notificationDto.getNotificationType())
                    .sender(sender)
                    .recipient(recipient)
                    .sentAt(LocalDateTime.now().truncatedTo(ChronoUnit.SECONDS))
                    .build();
            
            Notification notificationSaved = notificationRepository.save(notification);
            return notificationSaved.getId();
        }
        return null;
    }

    public void readNotification(long notificationId) {
        Optional<Notification> notification = notificationRepository.findById(notificationId);
        if(notification.isPresent()) {
            Notification notifi = notification.get();
            notifi.setStatus(CommunicationStatus.READ);
            notificationRepository.save(notifi);
        }
    }

    public void removeNotificaion(long notificationId) {
        Optional<Notification> notification = notificationRepository.findById(notificationId);
        if(notification.isPresent()) {
            notificationRepository.delete(notification.get());
        } else {
            throw new ResourceNotFoundException("KHÔNG CÓ THÔNG BÁO ĐỂ XÓA");
        }
    }

    public List<NotificationDto> getNotificationByRecipient(Long recipient) {
        List<Notification> listNotification = notificationRepository.findByRecipientId(recipient);
        if (!listNotification.isEmpty()) {
            return listNotification.stream()
                    .map(notifi -> {
                        String avatarUrl = imageService.getAvartaByAccountId(notifi.getSender().getId());
                        String nameSender = accountService.getById(notifi.getSender().getId()).getFullName();
                        return NotificationDto.builder()
                            .id(notifi.getId())
                            .tagetId(notifi.getTagetId())
                            .content(notifi.getContent())
                            .status(notifi.getStatus())
                            .sender(notifi.getSender().getId())
                            .recipient(notifi.getRecipient().getId())
                            .notificationType(notifi.getNotificationType())
                            .thumNail(avatarUrl)
                            .nameSender(nameSender)
                            .sentAt(notifi.getSentAt().format(ConstUltil.DATE_TIME_FORMATTER))
                            .build();
                    }).toList();
        }
        return Collections.emptyList();
    }

    public List<NotificationDto> getNotificationBySender(Long sender) {
        List<Notification> listNotification = notificationRepository.findBySenderId(sender);
        
        if (!listNotification.isEmpty()) {
            return listNotification.stream()
                .map(notifi -> NotificationDto.builder()
                    .id(notifi.getId())
                    .tagetId(notifi.getTagetId())
                    .content(notifi.getContent())
                    .status(notifi.getStatus())
                    .sender(notifi.getSender().getId())
                    .notificationType(notifi.getNotificationType())
                    .recipient(notifi.getRecipient().getId())
                    .build()).toList();
        }
        return Collections.emptyList();
    }

	@Override
	public void deleteNotificationsBySender(long senderId, long recipientId) {
		 List<Notification> notificationList = notificationRepository.findBySenderIdAndRecipientId(senderId, recipientId);
	        if(!notificationList.isEmpty()) {
	        	for (Notification notification : notificationList) {
	        		notificationRepository.delete(notification);
				}
	        } else {
	            throw new ResourceNotFoundException("KHÔNG CÓ THÔNG BÁO ĐỂ XÓA");
	        }
	}
}
