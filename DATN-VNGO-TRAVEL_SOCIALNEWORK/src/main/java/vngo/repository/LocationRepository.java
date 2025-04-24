package vngo.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import vngo.entity.Location;

@Repository
public interface LocationRepository extends JpaRepository<Location, Long> {
	 @Query("SELECT l FROM Location l JOIN l.locationDetails ld WHERE ld.tour.id = :tourId")
	 List<Location> findLocationsByTourId(@Param("tourId") Long tourId);
	 
	 
	 @Transactional
	    @Modifying
	    @Query("DELETE FROM Location l WHERE l.id IN "
	         + "(SELECT ld.location.id FROM LocationDetail ld JOIN ld.tour t WHERE t.id = :tourId)")
	    void deleteLocationsByTourId(@Param("tourId") Long tourId);
	 
	 List<Location> findByCreateBy_Id(Long createById);
}
