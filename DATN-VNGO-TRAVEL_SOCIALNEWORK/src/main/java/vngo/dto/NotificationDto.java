package vngo.dto;

import jakarta.persistence.Column;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import vngo.entity.Account;
import vngo.ultil.CommunicationStatus;
import vngo.ultil.Gender;
import vngo.ultil.NotificationType;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class NotificationDto {
	@Id
	private Long id;

	Long recipient;

	Long sender;

	Long tagetId;

	NotificationType notificationType;

	CommunicationStatus status;

	String content;

	String thumNail;

	String nameSender;

	String sentAt;

	
}
