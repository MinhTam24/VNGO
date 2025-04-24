package vngo.service;

import java.util.List;

import org.springframework.stereotype.Service;

import vngo.dto.LocationDto;

@Service
public interface LocationService {
	List<LocationDto> getLocationByTourId(Long id);
	
	Boolean deleteLocationsByTourId(Long tourId);
	
	List<LocationDto> findByCreateBy(Long createBy);
}
