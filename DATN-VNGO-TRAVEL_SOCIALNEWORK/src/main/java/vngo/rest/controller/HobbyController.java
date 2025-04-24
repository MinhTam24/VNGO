package vngo.rest.controller;

import java.util.Collections;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

import vngo.dto.HobbyDto;
import vngo.exception.ResourceNotFoundException;
import vngo.impl.HobbyServiceImpl;
import vngo.service.HobbyService;

@CrossOrigin({"http://localhost:3000", "http://192.168.7.181:3000"})
@RestController
public class HobbyController {

	@Autowired
	HobbyService hobbyService;
	
	
	@GetMapping("/hobby")
	public ResponseEntity<List<HobbyDto>> getListHobby() {
		try {
			List<HobbyDto> listHobby = hobbyService.getAll();
			return ResponseEntity.ok(listHobby);
		}catch (ResourceNotFoundException e) {
			return ResponseEntity.notFound().build();
		}
		
	}
	
	@GetMapping("/hobbies/{id}")
	public ResponseEntity<?> getHobbiesByAccountId(@PathVariable Long id) {
	    try {
	        // Gọi service để lấy danh sách hobbies của tài khoản
	        List<HobbyDto> hobbies = hobbyService.getHobbiesByAccountId(id);

	        if (hobbies.isEmpty()) {
	            return ResponseEntity.ok(Collections.emptyList());
	        }
	        return ResponseEntity.ok(hobbies); // Trả về danh sách hobbies
	    } catch (RuntimeException e) {
	        // Ném lỗi nếu không tìm thấy tài khoản
	        return ResponseEntity.status(404).body("Không tìm thấy tài khoản với ID: " + id);
	    } catch (Exception e) {
	        // Trả về lỗi 500 nếu xảy ra lỗi không xác định
	        return ResponseEntity.status(500).body("Đã xảy ra lỗi trong quá trình xử lý.");
	    }
	}
	
}
