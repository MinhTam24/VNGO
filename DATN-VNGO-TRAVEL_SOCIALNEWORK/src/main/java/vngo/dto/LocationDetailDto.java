package vngo.dto;

import java.time.LocalTime;

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
import vngo.entity.Location;
import vngo.entity.Tour;
import vngo.ultil.Vehicle;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class LocationDetailDto {
	Long id;

	String description;

	String position;

	Double price;

	String startHour;

	String endHour;

	Vehicle vehicle;
	
	String createDate;


	
	private Long tour;

	
	private Long location;
	
}
