package vngo.service;

import org.springframework.stereotype.Service;

import vngo.dto.LocationDetailDto;
import vngo.dto.LocationDto;

@Service
public interface LocationDetailService {
	LocationDetailDto getLocationDetailByTourAndLocation(Long tourId, Long locationId);
	void addDetailLocation(long tourId, long locationId, String position);
}
