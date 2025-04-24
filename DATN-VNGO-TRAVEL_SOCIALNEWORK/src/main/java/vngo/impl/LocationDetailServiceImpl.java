package vngo.impl;

import java.io.Console;
import java.lang.StackWalker.Option;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.Optional;

import org.apache.tomcat.util.bcel.Const;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import vngo.dto.LocationDetailDto;
import vngo.dto.TourDto;
import vngo.entity.Location;
import vngo.entity.LocationDetail;
import vngo.entity.Tour;
import vngo.exception.ResourceNotFoundException;
import vngo.repository.LocationDetailRepository;
import vngo.repository.LocationRepository;
import vngo.repository.TourRepository;
import vngo.service.LocationDetailService;
import vngo.service.LocationService;
import vngo.ultil.ConstUltil;

@Service
public class LocationDetailServiceImpl extends BaseServiceImpl<LocationDetailDto, Long>
		implements LocationDetailService {

	@Autowired
	LocationDetailRepository locationDetailRepository;

	@Autowired
	TourRepository tourRepository;

	@Autowired
	LocationRepository locationrepository;

	@Override
	public void insert(LocationDetailDto locationDetailDto) {
		Optional<Tour> tourOpt = tourRepository.findById(locationDetailDto.getTour());
		Optional<Location> locationOpt = locationrepository.findById(locationDetailDto.getLocation());
		LocationDetail locationDetail = LocationDetail.builder().description(locationDetailDto.getDescription())
				.createDate(LocalDateTime.now().truncatedTo(ChronoUnit.SECONDS))
				.position(null).price(locationDetailDto.getPrice())
				.startHour(LocalTime.parse(locationDetailDto.getStartHour(), ConstUltil.TIME_FORMATTER))
				.endHour(LocalTime.parse(locationDetailDto.getEndHour(), ConstUltil.TIME_FORMATTER))
				.vehicle(locationDetailDto.getVehicle()).tour(tourOpt.get()).location(locationOpt.get()).build();
		locationDetailRepository.save(locationDetail);
	}

	@Override
	public LocationDetailDto update(LocationDetailDto locationDetailDto) {
	    Optional<LocationDetail> locationDetailOpt = locationDetailRepository.findById(locationDetailDto.getId());
	    if (locationDetailOpt.isPresent()) {
	        LocationDetail locationDetail = locationDetailOpt.get();

	        locationDetail.setDescription(locationDetailDto.getDescription());
	        locationDetail.setPrice(locationDetailDto.getPrice());
	        locationDetail.setStartHour(LocalTime.parse(locationDetailDto.getStartHour(), ConstUltil.TIME_FORMATTER));
	        locationDetail.setEndHour(LocalTime.parse(locationDetailDto.getEndHour(), ConstUltil.TIME_FORMATTER));
	        locationDetail.setVehicle(locationDetailDto.getVehicle());

	        if (locationDetailDto.getPosition() != null) {
	            locationDetail.setPosition(locationDetailDto.getPosition());
	        }
	        locationDetailRepository.save(locationDetail);
	        return locationDetailDto;
	    }
	    throw new ResourceNotFoundException("Không có tài khoản");
	}


	@Override
	public boolean delete(Long id) {
		if (getById(id) != null) {
			locationDetailRepository.deleteById(id);
			return true;
		}
		throw new ResourceNotFoundException("Không tìm thấy địa điểm nào trong hệ thống để xóa");
	}

	@Override
	public LocationDetailDto getById(Long id) {
		Optional<LocationDetail> locationDetailOpt = locationDetailRepository.findById(id);
		if (locationDetailOpt.isPresent()) {
			LocationDetail locationDetail = locationDetailOpt.get();

			LocationDetailDto locationDetailDto = LocationDetailDto.builder().id(locationDetail.getId())
					.createDate(locationDetail.getCreateDate().format(ConstUltil.DATE_FORMATTER))
					.description(locationDetail.getDescription()).position(locationDetail.getPosition())
					.price(locationDetail.getPrice())
					.startHour(locationDetail.getStartHour().format(ConstUltil.TIME_FORMATTER))
					.endHour(locationDetail.getEndHour().format(ConstUltil.TIME_FORMATTER))
					.vehicle(locationDetail.getVehicle()).tour(locationDetail.getTour().getId()).build();
			return locationDetailDto;
		}
		return null;
	}

	@Override
	public List<LocationDetailDto> getAll() {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	public LocationDetailDto getLocationDetailByTourAndLocation(Long tourId, Long locationId) {
		Optional<Tour> tour = tourRepository.findById(tourId);
		Optional<Location> location = locationrepository.findById(locationId);
		if (tour.isPresent() && location.isPresent()) {
			Optional<LocationDetail> locationDetailOpt = locationDetailRepository.findByTourAndLocation(tour.get(),
					location.get());
			if (locationDetailOpt.isPresent()) {
				LocationDetail locationDetail = locationDetailOpt.get();
				LocationDetailDto locationDetailDto = LocationDetailDto.builder().id(locationDetail.getId())
						.description(locationDetail.getDescription()).position(locationDetail.getPosition())
						.price(locationDetail.getPrice())
						.startHour(locationDetail.getStartHour().format(ConstUltil.TIME_FORMATTER))
						.endHour(locationDetail.getEndHour().format(ConstUltil.TIME_FORMATTER))
						.vehicle(locationDetail.getVehicle()).tour(tourId).location(locationId).build();
				return locationDetailDto;
			} else {
				throw new ResourceNotFoundException("Không tìm thấy chi tiết địa điểm");
			}
		} else {
			throw new ResourceNotFoundException("Không tìm thấy địa điểm hoặc chuyến đi");
		}
	}

	@Override
	public void addDetailLocation(long tourId, long locationId, String position) {
	    Tour tour = tourRepository.findById(tourId)
	            .orElseThrow(() -> new ResourceNotFoundException("Tour không tồn tại: " + tourId));

	    Pageable pageable =  PageRequest.of(0, 1);
	    List<LocationDetail> locationDetailsOpt = locationDetailRepository.findBylocationId(locationId, pageable );

	    if (!locationDetailsOpt.isEmpty()) {
	        LocationDetail locationDetail = locationDetailsOpt.get(0);

	        if (!locationDetail.getTour().getId().equals(tourId)) {
	            LocationDetail newLocationDetail = new LocationDetail();
	            newLocationDetail.setEndHour(locationDetail.getEndHour());
	            newLocationDetail.setLocation(locationDetail.getLocation());
	            newLocationDetail.setPosition(position);
	            newLocationDetail.setPrice(locationDetail.getPrice());
	            newLocationDetail.setStartHour(locationDetail.getStartHour());
	            newLocationDetail.setVehicle(locationDetail.getVehicle());
	            newLocationDetail.setTour(tour); // Gắn Tour mới
	            newLocationDetail.setDescription(locationDetail.getDescription());
	            newLocationDetail.setCreateDate(LocalDateTime.now().truncatedTo(ChronoUnit.SECONDS));
	            locationDetailRepository.save(newLocationDetail);
	            System.out.println(newLocationDetail);
	        }else {
	            locationDetail.setPosition(position);
	            locationDetailRepository.save(locationDetail);
	        }
	    } else {
	        throw new ResourceNotFoundException("Không tìm thấy Location với ID: " + locationId);
	    }
	}
	
	private String appendSeconds(String time) {
	    if (time.length() == 5) { // Định dạng HH:mm
	        return time + ":00";
	    }
	    return time; // Đã có giây
	}	


}
