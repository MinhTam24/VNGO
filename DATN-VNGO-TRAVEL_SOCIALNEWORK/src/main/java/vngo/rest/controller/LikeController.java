package vngo.rest.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.relational.core.sql.Like;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RestController;

import com.fasterxml.jackson.databind.ser.std.NumberSerializers.IntLikeSerializer;

import vngo.dto.LikeDto;
import vngo.entity.Likes;
import vngo.impl.AccountServiceImpl;
import vngo.service.AccountService;
import vngo.service.LikesService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;

@CrossOrigin({"http://localhost:3000", "http://192.168.7.181:3000"})
@RestController
public class LikeController {

	@Autowired
	LikesService likesService;

	@PostMapping("/api/likes")
	public ResponseEntity<?> like(@RequestParam("blogId") Long blogId, @RequestParam("accountID") Long accountID) {
		System.out.println("BLogID" + blogId + "accountID" + accountID);
	    try {
	        return ResponseEntity.ok(likesService.addLike(blogId, accountID));
	    } catch (Exception e) {
	        return ResponseEntity.badRequest().body("Error: " + e.getMessage());
	    }
	}

	@GetMapping("/api/count-likes")
	public ResponseEntity<?> countLike(@RequestParam("blogId") Long blogId) {
	    try {
	        Long likeCount = likesService.countLikeByBlogId(blogId);
	        return ResponseEntity.ok(likeCount);
	    } catch (Exception e) {
	        return ResponseEntity.badRequest().body("Error: " + e.getMessage());
	    }
	}

	@GetMapping("/api/likes")
	public ResponseEntity<?> getListLike(@RequestParam Long blogId) {
	    try {
	        List<LikeDto> listLike = likesService.getListLikeByBlogId(blogId);
	        return ResponseEntity.ok(listLike);
	    } catch (Exception e) {
	        return ResponseEntity.badRequest().body("Error: " + e.getMessage());
	    }
	}

	@GetMapping("/api/like/status")
	public ResponseEntity<?> isLiked(@RequestParam("blogId") Long blogId, @RequestParam("accountID") Long accountID) {
	    try {
	        boolean isLiked = likesService.isLiked(blogId, accountID);
	        return ResponseEntity.ok(isLiked);
	    } catch (Exception e) {
	        return ResponseEntity.badRequest().body("Error: " + e.getMessage());
	    }
	}


	@DeleteMapping	("/api/unlike")
	public ResponseEntity<?> unlike(@RequestParam("blogId") Long blogId, @RequestParam("accountID") Long accountID) {
	    try {
	        likesService.removeLike(blogId, accountID);
	        return ResponseEntity.ok("Successfully removed like.");
	    } catch (Exception e) {
	        return ResponseEntity.badRequest().body("Error: " + e.getMessage());
	    }
	}

}
