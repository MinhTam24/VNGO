package vngo.rest.controller;

import java.io.IOException;
import java.util.List;
import java.util.Map;

import org.apache.http.HttpStatus;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import vngo.service.CloudinaryService;

@CrossOrigin({"http://localhost:3000" , "http://192.168.7.181:3000"})
@RestController
public class CloudinaryController {

	@Autowired
	CloudinaryService cloudinaryService;

	@PostMapping("/cloudinary/upload")
	public ResponseEntity<List<String>> uploadImage(@RequestParam("images") List<MultipartFile> files)
			throws IOException {
		List<String> imageUrlList = cloudinaryService.upload(files);
		return ResponseEntity.ok(imageUrlList);
	}

}
