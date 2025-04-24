package vngo.dto;

import java.time.LocalDateTime;
import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;



@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BlogDto {
	
	Long id;
	
	String createdAt;
	
	String fullName;
	
	String avatarUrl;
	
	Boolean isActivated;
	
	String decription;
	
	private Long createdBy;
	
	private Long tour;
	
	List<String> imageUrl;

}
