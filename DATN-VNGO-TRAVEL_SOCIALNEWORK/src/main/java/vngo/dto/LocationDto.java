package vngo.dto;

import java.time.LocalTime;

import jakarta.persistence.Column;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class LocationDto {
	
	Long id;
	
	String name;
	
	String address;
	
	String createDate;
	
	String modifiedAt;
	
	String province;
	
	String coordinates;
	
	LocationDetailDto locationDetailDto;
	
	long createBy;
	
}
