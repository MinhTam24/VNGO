package vngo.dto;

import lombok.Builder;
import lombok.Data;
import vngo.entity.Account;

@Data
@Builder
public class LikeDto {
	Long id;
	Account createdBy;
	Long blog;
	String likeAt;
}
