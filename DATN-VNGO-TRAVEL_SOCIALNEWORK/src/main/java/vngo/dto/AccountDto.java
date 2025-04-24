package vngo.dto;

import java.time.LocalDate;
import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import vngo.entity.Account;
import vngo.ultil.AccountStatus;
import vngo.ultil.CommunicationStatus;
import vngo.ultil.Gender;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AccountDto {
	@Id
	private Long id;
	private String email;
	private String firstName;
	private String fullName;
	private String birthday;
	private String address;
	private String phone;
	private boolean isActivated = true;
	private Gender gender;
	private String avatarUrl; 
	private AccountStatus status;
}
