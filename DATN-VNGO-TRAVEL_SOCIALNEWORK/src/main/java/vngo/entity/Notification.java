package vngo.entity;

import java.time.LocalDateTime;

import com.fasterxml.jackson.annotation.JsonBackReference;

import jakarta.annotation.Generated;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import vngo.ultil.CommunicationStatus;
import vngo.ultil.NotificationType;

@Data
@Entity
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Table(name = "notification")
public class Notification {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private long id;
	
	@JsonBackReference
	@ManyToOne
	@JoinColumn(name ="notification_recipient")
	Account recipient;
	
	@JsonBackReference
	@ManyToOne
	@JoinColumn(name = "notification_sender")
	Account sender;
	
	@Enumerated(EnumType.STRING)
	@Column(name = "taget_type")
	NotificationType notificationType;
	
	@Column(name = "taget_id")
	Long tagetId;
	
	@Column(name = "sent_at")
	LocalDateTime sentAt;
	
	
	@Enumerated(EnumType.STRING)
	@Column(name = "status")
	CommunicationStatus status;
	
	String content;
}
