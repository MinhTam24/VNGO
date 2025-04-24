package vngo.dto;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import vngo.entity.Blog;
import vngo.entity.Follow;
import vngo.entity.Hobby;
import vngo.entity.Tour;
import vngo.ultil.Gender;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ProfileDto {
	
	Long id;
	
	String email;
	
	String password;
	
	String firstName;
	
	String fullName;
	
 	private LocalDate birthday;
	
	String address;
	
	String phone;
	
	Gender gender;
	
	private List<Hobby> userHobbies;
	
	private List<Follow> follower;
	
	String avatarUrl;
	
}