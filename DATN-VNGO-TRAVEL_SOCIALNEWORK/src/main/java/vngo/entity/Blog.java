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
import vngo.ultil.Vehicle;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
@Table(name = "blog")
public class Blog {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	Long id;
	
	@JsonIgnore
	@ManyToOne
	@JoinColumn(name = "created_by", referencedColumnName = "id", nullable = false)
	private Account createBy;
	
	@Column(name = "created_at")
	LocalDateTime createdAt;
	
	@Column(name = "is_activated")
	Boolean isActivated;
	
	@Column(name = "decription")
	String decription;
	
	@JsonManagedReference
	@OneToMany(mappedBy = "blog")
	List<Likes> listLike;
	
	@JsonManagedReference
	@OneToMany(mappedBy = "blog")
	List<Comment> listCommet;

	@JsonIgnore
	@OneToOne
	@JoinColumn(name = "tour_id", referencedColumnName = "id", nullable = true)
	private Tour tour;
		

}
