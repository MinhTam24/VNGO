package vngo.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import vngo.entity.Notification;

@Repository
public interface NotificationRepository extends JpaRepository<Notification, Long> {
		List<Notification> findBySenderId(Long id);
		List<Notification> findByRecipientId(Long id);
		List<Notification> findBySenderIdAndRecipientId(Long senderId, Long recipientId);
}
