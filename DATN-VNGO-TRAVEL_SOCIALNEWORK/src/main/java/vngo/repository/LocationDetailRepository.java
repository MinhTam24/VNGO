package vngo.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import vngo.entity.Location;
import vngo.entity.LocationDetail;
import vngo.entity.Tour;

public interface LocationDetailRepository  extends JpaRepository<LocationDetail, Long>{
	
	Optional<LocationDetail> findByTourAndLocation(Tour tour, Location location);
	
	
	@Query("SELECT ld FROM LocationDetail ld " +
		       "WHERE ld.location.id = :locationId " +
		       "ORDER BY ld.createDate DESC")
	List<LocationDetail> findBylocationId(@Param("locationId") Long locationId, Pageable pageable);


}
