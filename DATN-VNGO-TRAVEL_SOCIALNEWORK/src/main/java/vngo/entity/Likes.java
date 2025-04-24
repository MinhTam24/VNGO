package vngo.entity;

import java.time.LocalDateTime;

import com.fasterxml.jackson.annotation.JsonBackReference;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;


@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "likes")
public class Likes {
	
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	Long id;
	
	@JsonBackReference
	@ManyToOne
    @JoinColumn(name = "created_by")
	Account createdBy;
	
	@JsonBackReference
	@ManyToOne
    @JoinColumn(name = "blog_id")
	Blog blog;
	
	@Column(name = "like_at")
	LocalDateTime likeAt;
	
	@Column(name = "is_activated")
	Boolean is_activated;
	
}
