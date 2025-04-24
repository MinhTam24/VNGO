package vngo.impl;

import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.crossstore.ChangeSetPersister.NotFoundException;
import org.springframework.stereotype.Service;

import vngo.dto.LocationDetailDto;
import vngo.dto.LocationDto;
import vngo.dto.TourDto;
import vngo.entity.Account;
import vngo.entity.Location;
import vngo.entity.LocationDetail;
import vngo.entity.Tour;
import vngo.exception.ResourceNotFoundException;
import vngo.repository.AccountRepository;
import vngo.repository.LocationDetailRepository;
import vngo.repository.LocationRepository;
import vngo.repository.TourRepository;
import vngo.service.LocationService;
import vngo.ultil.ConstUltil;

@Service
public class LocationServiceImpl extends BaseServiceImpl<LocationDto, Long> implements LocationService {

	@Autowired
	LocationRepository locationrepository;

	@Autowired
	LocationDetailRepository locationDetailRepository;

	@Autowired
	LocationDetailServiceImpl locationDetailServiceImpl;

	@Autowired
	AccountRepository accountRepository;

	@Autowired
	TourRepository tourRepository;

	@Override
	public void insert(LocationDto locationdto) {

		Tour tour = tourRepository.findById(locationdto.getLocationDetailDto().getTour())
				.orElseThrow(() -> new ResourceNotFoundException("Không tồn tại tour"));
		System.out.println(tour.getCreateBy().getId());

		Location location = Location.builder().name(locationdto.getName()).address(locationdto.getAddress())
				.createDate(LocalDateTime.now().truncatedTo(ChronoUnit.SECONDS)).province(locationdto.getProvince())
				.createBy(tour.getCreateBy()).coordinates(locationdto.getCoordinates()).build();
		locationrepository.save(location);

		LocationDetailDto locationDetailDto = locationdto.getLocationDetailDto();
		locationDetailDto.setLocation(location.getId());

		locationDetailServiceImpl.insert(locationDetailDto);

	}
	
	public long createLocation(LocationDto locationdto) {
		Tour tour = tourRepository.findById(locationdto.getLocationDetailDto().getTour())
				.orElseThrow(() -> new ResourceNotFoundException("Không tồn tại tour"));
		System.out.println(tour.getCreateBy().getId());

		Location location = Location.builder().name(locationdto.getName()).address(locationdto.getAddress())
				.createDate(LocalDateTime.now().truncatedTo(ChronoUnit.SECONDS)).province(locationdto.getProvince())
				.createBy(tour.getCreateBy()).coordinates(locationdto.getCoordinates()).build();
		Location  savedLocation =locationrepository.save(location);

		LocationDetailDto locationDetailDto = locationdto.getLocationDetailDto();
		locationDetailDto.setLocation(location.getId());

		locationDetailServiceImpl.insert(locationDetailDto);
		return savedLocation.getId();
	}
	
	

	@Override
	public LocationDto update(LocationDto locationDto) {
		Optional<Location> locationOpt = locationrepository.findById(locationDto.getId());
		if (locationOpt.isPresent()) {
			Location location = locationOpt.get();
			location.setName(locationDto.getName());
			location.setAddress(locationDto.getAddress());
			location.setModifiedAt(LocalDateTime.now().truncatedTo(ChronoUnit.SECONDS));
			location.setProvince(locationDto.getProvince());
			location.setCoordinates(locationDto.getCoordinates());
			locationrepository.save(location);
			return locationDto;
		}
		throw new ResourceNotFoundException("Địa điểm k tồn tại");
	}

	@Override
	public boolean delete(Long id) {
		if (getById(id) != null) {
			locationrepository.deleteById(id);
			return true;
		} else {
			throw new ResourceNotFoundException("Không tìm thấy địa điểm nào trong hệ thống để xóa");
		}
	}

	@Override
	public LocationDto getById(Long id) {
		Optional<Location> locationOpt = locationrepository.findById(id);
		if (locationOpt.isPresent()) {
			Location location = locationOpt.get();
			LocationDto locationdto = LocationDto.builder().id(location.getId()).name(location.getName())
					.address(location.getAddress())
					.createDate(location.getCreateDate().format(ConstUltil.DATE_FORMATTER))
					.modifiedAt(Optional.ofNullable(location.getModifiedAt())
							.map(modifiedAt -> modifiedAt.format(ConstUltil.DATE_TIME_FORMATTER)).orElse(null))
					.province(location.getProvince()).createBy(location.getCreateBy().getId())
					.coordinates(location.getCoordinates()).build();
			return locationdto;
		} else {
			throw new ResourceNotFoundException("Không tìm thấy địa điểm nào trong hệ thống");
		}
	}

	@Override
	public List<LocationDto> getAll() {
		List<Location> locationList = locationrepository.findAll();
		if (locationList.isEmpty()) {
			throw new ResourceNotFoundException("Không tìm thấy địa điểm nào trong hệ thống");
		} else {
			List<LocationDto> listLocationDto = locationList.stream()
					.map(location -> LocationDto.builder().id(location.getId()).name(location.getName())
							.address(location.getAddress())
							.createDate(location.getCreateDate().format(ConstUltil.DATE_FORMATTER))
							.modifiedAt(Optional.ofNullable(location.getModifiedAt())
									.map(modifiedAt -> modifiedAt.format(ConstUltil.DATE_TIME_FORMATTER)).orElse(null))
							.createBy(location.getCreateBy().getId()).province(location.getProvince())
							.coordinates(location.getCoordinates()).build())
					.toList();
			return listLocationDto;
		}
	}

	@Override
	public List<LocationDto> getLocationByTourId(Long id) {
		List<Location> listLocations = locationrepository.findLocationsByTourId(id);
		if (listLocations != null) {
			List<LocationDto> listLocationDtos = listLocations.stream()
					.map(location -> LocationDto.builder().id(location.getId()).name(location.getName())
							.address(location.getAddress())
							.createDate(location.getCreateDate().format(ConstUltil.DATE_FORMATTER))
							.modifiedAt(Optional.ofNullable(location.getModifiedAt())
									.map(modifiedAt -> modifiedAt.format(ConstUltil.DATE_TIME_FORMATTER)).orElse(null))
							.createBy(location.getCreateBy().getId()).province(location.getProvince())
							.coordinates(location.getCoordinates()).build())
					.toList();
			return listLocationDtos;
		}
		throw new ResourceNotFoundException("NO LOCATION");
	}

	@Override
	public Boolean deleteLocationsByTourId(Long tourId) {
		locationrepository.deleteLocationsByTourId(tourId);
		return true;
	}

	@Override
	public List<LocationDto> findByCreateBy(Long createBy) {
		List<Location> locations = locationrepository.findByCreateBy_Id(createBy);
		if (locations.isEmpty()) {
			throw new ResourceNotFoundException("Không tìm thấy địa điểm nào trong hệ thống");
		} else {
			List<LocationDto> listLocationDto = locations.stream()
					.map(location -> LocationDto.builder().id(location.getId()).name(location.getName())
							.address(location.getAddress())
							.createDate(location.getCreateDate().format(ConstUltil.DATE_FORMATTER))
							.modifiedAt(Optional.ofNullable(location.getModifiedAt())
									.map(modifiedAt -> modifiedAt.format(ConstUltil.DATE_TIME_FORMATTER)).orElse(null))
							.createBy(location.getCreateBy().getId()).province(location.getProvince())
							.coordinates(location.getCoordinates()).build())
					.toList();
			return listLocationDto;
		}
	}
}
