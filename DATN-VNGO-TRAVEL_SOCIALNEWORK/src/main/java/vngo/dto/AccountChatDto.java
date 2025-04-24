package vngo.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AccountChatDto {
	long id;
	String firstName;
	String fullName;
	String avatarUrl;
}
