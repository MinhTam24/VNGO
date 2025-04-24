package vngo.rest.controller;

import java.io.Console;
import java.io.IOException;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
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
import vngo.entity.Blog;
import vngo.exception.ResourceNotFoundException;
import vngo.impl.BlogServiceImpl;
import vngo.service.BlogService;

@CrossOrigin({"http://localhost:3000", "http://192.168.7.181:3000"})
@RestController
public class BlogController {
	@Autowired
	BlogServiceImpl blogServiceImpl;

	@Autowired
	BlogService blogService;

	@GetMapping("/api/blog")
	public ResponseEntity<List<BlogDto>> getBlogToList() {
		try {
			List<BlogDto> blogDto = blogServiceImpl.getAll();
			return ResponseEntity.ok(blogDto);
		} catch (Exception e) {
			return ResponseEntity.notFound().build();
		}
	}

	@GetMapping("/api/blog/{id}")
	public ResponseEntity<BlogDto> getBlogById(@PathVariable Long id) {
		BlogDto blogdto = blogServiceImpl.getById(id);
		return ResponseEntity.ok(blogdto);
	}

	@PostMapping("/api/blog")
	public ResponseEntity<Void> createBlog(
	        @ModelAttribute BlogDto blogDto,
	        @RequestParam(value = "files", required = false) List<MultipartFile> files) throws IOException {

	    blogServiceImpl.CreateBlog(blogDto, files);
	    return ResponseEntity.status(HttpStatus.OK).build();
	}


	@PutMapping("/api/blog")
	public ResponseEntity<Void> updateBlog( @ModelAttribute BlogDto blogDto,
	        @RequestParam(value = "files", required = false) List<MultipartFile> files) throws IOException {
		
		System.out.println("BLOG DTO" + blogDto.getId());
		System.out.println("BLOG DTO" + blogDto.getDecription());

		try {
			blogServiceImpl.updates(blogDto, files);
			return ResponseEntity.status(HttpStatus.OK).build();
		} catch (ResourceNotFoundException e) {
			return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
		}
	}

	@DeleteMapping("/api/blog")
	public ResponseEntity<Void> deleteBlog(@RequestParam Long id) {
		try {
			blogServiceImpl.delete(id);
			return ResponseEntity.status(HttpStatus.OK).build();
		} catch (Exception e) {
			return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
		}
	}

	@GetMapping("/api/blog-page")
	public ResponseEntity<List<BlogDto>> getBlogToList(@RequestParam(defaultValue = "0") int page,
	        @RequestParam(defaultValue = "10") int size) {
	    try {
	        List<BlogDto> blogDto = blogServiceImpl.getAllPage(page, size);
	        // Nếu không có dữ liệu, trả về mã 204 (No Content)
	        if (blogDto == null || blogDto.isEmpty()) {
	            return ResponseEntity.noContent().build();
	        }
	        return ResponseEntity.ok(blogDto);
	    } catch (Exception e) {
	        return ResponseEntity.notFound().build();
	    }
	}
	
	@GetMapping("/api/blog-createBy")
	public ResponseEntity<List<BlogDto>> getBlogByCreateById(@RequestParam("accountId") Long id){
		List<BlogDto> listBlog = blogServiceImpl.getAllBlogByCreateBy(id);
		return ResponseEntity.ok(listBlog);
	}


}
