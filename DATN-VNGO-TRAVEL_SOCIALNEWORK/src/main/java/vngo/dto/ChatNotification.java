package vngo.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import vngo.ultil.CommunicationStatus;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ChatNotification {
	private Long id;
	private Long senderId;
	private Long recipientId;
	private String content;
}
