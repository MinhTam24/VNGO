package vngo.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import vngo.entity.Tour;

@Repository
public interface TourRepository extends JpaRepository<Tour, Long>{
}
