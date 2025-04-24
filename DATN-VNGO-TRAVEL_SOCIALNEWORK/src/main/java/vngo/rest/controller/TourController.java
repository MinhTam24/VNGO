package vngo.rest.controller;

import java.io.IOException;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.ResponseEntity;
import org.springframework.web.ErrorResponse;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import vngo.dto.BlogDto;
import vngo.dto.TourDto;
import vngo.entity.Tour;
import vngo.exception.ResourceNotFoundException;
import vngo.impl.TourServiceImpl;

@CrossOrigin({"http://localhost:3000", "http://192.168.7.181:3000"})
@RestController
public class TourController {
	@Autowired
	TourServiceImpl tourserviceImpl;
	
	
	@GetMapping("/api/tour")
	public ResponseEntity<List<TourDto>> getTourToList(){
		try {
			List<TourDto> tourdto = tourserviceImpl.getAll();
			return ResponseEntity.ok(tourdto);
		} catch (ResourceNotFoundException e) {
			return ResponseEntity.notFound().build();
		}
	}
	
	@GetMapping("/api/tour/{id}")
	public ResponseEntity<TourDto> getTourById(@PathVariable Long id){
			TourDto tourdto = tourserviceImpl.getById(id);
			return ResponseEntity.ok(tourdto);
	
	}
	
	@GetMapping("/api/tour-createBy/{id}")
	public ResponseEntity<List<TourDto>> getTourByCreateById(@PathVariable Long id){
		List<TourDto> tourdto = tourserviceImpl.getListTourByCreateBY(id);
			return ResponseEntity.ok(tourdto);
	
	}
	
	@PostMapping("/api/tour-create")
	public ResponseEntity<Long> createTour() {
			Long id = tourserviceImpl.createTour();
			return ResponseEntity.ok(id);
		
	}

	
	@PutMapping("/api/tour-data")
	public ResponseEntity<Void> setDataTour(@ModelAttribute TourDto Dto, @RequestParam(value = "files", required = false) List<MultipartFile> files) throws IOException{
			tourserviceImpl.setDataTour(Dto, files);
			return ResponseEntity.status(HttpStatus.OK).build();
		
	}
	
	@PutMapping("/api/tour")
	public ResponseEntity<Void> updateTour(
			@ModelAttribute TourDto tourdto,
	        @RequestParam(value = "files", required = false) List<MultipartFile> files) throws IOException {
		
		System.out.println("File:" + files);
		System.out.println("TOUR DTO" + tourdto.getId());
		System.out.println("Tour DTO: " + tourdto);

		try {
			tourserviceImpl.updates(tourdto, files);
			return ResponseEntity.status(HttpStatus.OK).build();
		} catch (ResourceNotFoundException e) {
			return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
		}
	}
	
	@DeleteMapping("/api/tour/{id}")
	public ResponseEntity<Boolean> deleteTour(@PathVariable Long id){
		try {
			return ResponseEntity.ok(tourserviceImpl.delete(id));
		} catch (ResourceNotFoundException e) {
			return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
		}
	}
}
