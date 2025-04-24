package vngo.entity;

import java.time.LocalDateTime;
import java.time.LocalTime;

import org.hibernate.annotations.Collate;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import vngo.ultil.Vehicle;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
@Table(name = "locationdetail")
@JsonIgnoreProperties({"tour", "location"})
public class LocationDetail {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	Long id;

	@Column(name = "description")
	String description;

	@Column(name = "position")
	String position;
	
	@Column(name = "create_date")
	LocalDateTime createDate;

	@Column(name = "price")
	Double price;

	@Column(name = "start_hour")
	LocalTime startHour;

	@Column(name = "end_hour")
	LocalTime endHour;

	@Enumerated(EnumType.STRING)
	@Column(name = "vehicle")
	Vehicle vehicle;

	@JsonBackReference
	@ManyToOne
	@JoinColumn(name = "tour_id", referencedColumnName = "id", nullable = false)
	private Tour tour;

	@JsonBackReference
	@ManyToOne
	@JoinColumn(name = "location_id", referencedColumnName = "id", nullable = false)
	private Location location;
		
	@Override
	public String toString() {
	    return "LocationDetail{id=" + id + ", description='" + description + "'}";
	}


}
