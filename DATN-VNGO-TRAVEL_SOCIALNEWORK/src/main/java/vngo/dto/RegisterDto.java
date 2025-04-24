package vngo.dto;

import java.time.LocalDate;
import java.time.LocalDateTime;

import com.fasterxml.jackson.annotation.JsonIgnore;

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
import vngo.ultil.Gender;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RegisterDto {
	@Id
	Long id;
	String email;
	String passWord;
	String firstName;
	String fullName;
	String birthday;
	String createDate;
	String address;
	String phone;
	boolean isActivated = true;
	@Enumerated(EnumType.STRING)
	private Gender gender;
	private String createdBy;
}
