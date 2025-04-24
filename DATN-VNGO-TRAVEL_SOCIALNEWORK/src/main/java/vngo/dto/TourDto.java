package vngo.dto;

import java.time.LocalTime;
import java.util.List;

import org.springframework.web.multipart.MultipartFile;

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
public class TourDto {

	Long id;
	
	String descriptionTour;
	
	String ownerName;
	
	Long createBy;
	
	String createdAt;
	
	String modifiedAt;
	
	String startDate;
	
	String endDate;

    String addressTour;
	
	Double expense;
	
	int quantityMember;
	
	Boolean allowedToApply;
	
	String title;
	
	List<LocationDto> LocationDto;

	
	List<String> imageUrl;
	
	List<LocationDetailDto> LocationDetailDto;
 	

	}
