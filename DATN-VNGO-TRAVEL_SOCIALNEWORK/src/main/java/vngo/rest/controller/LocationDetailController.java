package vngo.rest.controller;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.repository.query.Param;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RestController;

import vngo.dto.LocationDetailDto;
import vngo.dto.TourDto;
import vngo.exception.ResourceNotFoundException;
import vngo.impl.LocationDetailServiceImpl;
import vngo.service.LocationDetailService;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;


@CrossOrigin({"http://localhost:3000", "http://192.168.7.181:3000"})
@RestController
public class LocationDetailController {
	
	@Autowired
	LocationDetailService locationDetailService;
	
	@Autowired
	LocationDetailServiceImpl locationDetailServiceImpl;
	
	@GetMapping("/api/locationdetail/{id}")
	public ResponseEntity<LocationDetailDto> getLocationDetailById(@PathVariable Long id){
		LocationDetailDto locationDetailDto = locationDetailServiceImpl.getById(id);
			return ResponseEntity.ok(locationDetailDto);
	
	}
	
	@PutMapping("/api/locationdetail")
	public ResponseEntity<Void> updateLocationDetail(@RequestBody LocationDetailDto Dto){
		try {
			locationDetailServiceImpl.update(Dto);
			return ResponseEntity.status(HttpStatus.OK).build();
		} catch (ResourceNotFoundException e) {
	        return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
		}
	}
	
	@PostMapping("/api/locationdetail-new")
	public ResponseEntity<Map<String, String>> addLocationDetail(@RequestParam("tourId") Long tourId, @RequestParam("locationId") Long locationId, @RequestParam("position") String position    ) {
	    try {
	        locationDetailService.addDetailLocation(tourId, locationId, position);
	        Map<String, String> successResponse = new HashMap<>();
	        successResponse.put("message", "Thêm LocationDetail thành công!");
	        return ResponseEntity.ok(successResponse);
	    } catch (Exception e) {
	        e.printStackTrace();
	        Map<String, String> errorResponse = new HashMap();
	        errorResponse.put("error", "Lỗi: " + e.getMessage());  // Trả về thông tin lỗi
	        return ResponseEntity.badRequest().body(errorResponse);
	    }
	}


		
}
