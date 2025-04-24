package vngo.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import jakarta.persistence.Tuple;
import vngo.entity.Image;
import vngo.ultil.ImageType;

@Repository
public interface ImageRepository extends JpaRepository<Image, Long> {

	@Query("SELECT i.imageUrl FROM Image i " + "WHERE i.imageType = :imagetype AND i.imageId = :imageId "
			+ "ORDER BY i.uploadAt DESC")
	List<String> findImageUrlByImageIdAndImageType(@Param("imageId") Long imageId,
			@Param("imagetype") ImageType imageType);

	void deleteByImageUrl(String imageUrl);
	
}