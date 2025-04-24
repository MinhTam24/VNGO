package vngo.service;

import java.util.List;

import org.springframework.stereotype.Service;

import vngo.dto.NotificationDto;
import vngo.ultil.NotificationType;

@Service
public interface NotificationService {
	Long addNotification(NotificationDto notificationDto);
	List<NotificationDto> getNotificationByRecipient(Long recipient);
	void removeNotificaion(long notificationId);
	void readNotification(long notificaionId);
	void deleteNotificationsBySender(long senderId, long recipientId);
}
