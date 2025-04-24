package vngo.entity;

import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import vngo.ultil.ImageType;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "images")
@Builder
public class Image {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	long id;
	
	@Column(name = "imageurl")
	String imageUrl;
	
	@Enumerated(EnumType.STRING)
	@Column(name = "tagettype")
	ImageType imageType;
	
	
	@Column(name = "upload_at")
	LocalDateTime uploadAt;
	
	@Column(name = "taget_id")
	Long imageId;
}
