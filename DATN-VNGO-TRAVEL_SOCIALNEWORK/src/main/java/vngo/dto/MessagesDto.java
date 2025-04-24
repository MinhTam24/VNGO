package vngo.dto;

import vngo.ultil.CommunicationStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MessagesDto {
	private Long id;
	private Long senderId;
	private Long recipientId;
	private String content;
	private String sentAt;
	private CommunicationStatus status;
	private CommunicationStatus senderStatus;
	private CommunicationStatus recipientStatus;
	
}
