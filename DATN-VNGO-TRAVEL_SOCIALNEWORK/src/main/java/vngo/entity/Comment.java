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
@Table(name = "comment")
public class Comment {
	
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	long id;
	
	@JsonBackReference
	@ManyToOne
	@JoinColumn(name = "blog_id")
	Blog blog;
	
	@JsonBackReference
	@ManyToOne
	@JoinColumn(name = "created_by")
	Account createdBy;
	
	@Column(name ="created_at")
	LocalDateTime createAt;
	
	@Column(name = "is_activated")
	Boolean isActivated;
	
	String content;
	
	
	
	
	

}
