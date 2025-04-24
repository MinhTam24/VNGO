package vngo.entity;

import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonManagedReference;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Builder
@Table(name = "location")
public class Location {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	Long id;

	@Column(name = "name")
	String name;

	@Column(name = "address")
	String address;

	@Column(name = "created_date")
	LocalDateTime createDate;

	@Column(name = "modified_at")
	LocalDateTime modifiedAt;

	@Column(name = "province")
	String province;

	@Column(name = "coordinates")
	String coordinates;

	@JsonIgnore
	@ManyToOne
	@JoinColumn(name = "createby", referencedColumnName = "id", nullable = false)
	private Account createBy;
	
    @JsonManagedReference
	@OneToMany(mappedBy = "location")
	private List<LocationDetail> locationDetails;

}
