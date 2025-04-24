package vngo.rest.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.service.annotation.GetExchange;

import vngo.dto.LocationDto;
import vngo.exception.ResourceNotFoundException;
import vngo.impl.LocationServiceImpl;
import vngo.repository.LocationRepository;
import vngo.service.LocationService;

@CrossOrigin({"http://localhost:3000", "http://192.168.7.181:3000"})
@RestController
public class LocationController {
	
	@Autowired
	LocationServiceImpl locationServiceImpl;
	
	@Autowired
	LocationService locationservice;
	
	@GetMapping("/api/location")
	public ResponseEntity<List<LocationDto>> getLocationList() {
		try {
			List<LocationDto> locationdtoList = locationServiceImpl.getAll();
			return ResponseEntity.ok(locationdtoList);
		} catch (ResourceNotFoundException e) {
	        return ResponseEntity.notFound().build();
		}
	}
	
	
	@GetMapping("/api/location/{id}")
	public ResponseEntity<LocationDto> getLocationById(@PathVariable long id){
		try {
			LocationDto locationdto = locationServiceImpl.getById(id);
			return ResponseEntity.ok(locationdto);
		} catch (ResourceNotFoundException e) {
			return ResponseEntity.notFound().build();
		}
	}
	
	
	@PostMapping("/api/location")
	public ResponseEntity<Long> createLocation(@RequestBody LocationDto locationdto) {
	    try {
	        // Gọi service để tạo mới Location, ví dụ:
	    	Long locationId = locationServiceImpl.createLocation(locationdto);

	        // Trả về HTTP 201 (Created) nếu tạo thành công
	        return ResponseEntity.ok(locationId);

	    } catch (ResourceNotFoundException e) {
	        // Nếu có lỗi, ví dụ dữ liệu không hợp lệ, trả về 400 (Bad Request)
	        return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
	    }
	}
	
	
	@PutMapping("/api/location")
	public ResponseEntity<Void> updateLocation(@RequestBody LocationDto locationdto){
		try {
			locationServiceImpl.update(locationdto);
			  return ResponseEntity.ok().build(); // Trả về HTTP 200 OK khi thành công
		} catch (ResourceNotFoundException e) {
	        return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
		}
	}
	
	
	@DeleteMapping("/api/location/{id}")
	public ResponseEntity<Void> deleteLocation(@PathVariable long id){
		try {
			locationServiceImpl.delete(id);
			return ResponseEntity.ok().build();
		} catch (ResourceNotFoundException e) {
	        return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
		}
	}
	
	
	@GetMapping("/api/location-createBY/{id}")
	public ResponseEntity<List<LocationDto>> getLocationList(@PathVariable long id) {
		try {
			List<LocationDto> locationdtoList = locationServiceImpl.findByCreateBy(id);
			return ResponseEntity.ok(locationdtoList);
		} catch (ResourceNotFoundException e) {
	        return ResponseEntity.notFound().build();
		}
	}

	
}
