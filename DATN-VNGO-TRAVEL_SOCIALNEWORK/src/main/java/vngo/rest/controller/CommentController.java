package vngo.rest.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.web.bind.annotation.*;

import lombok.RequiredArgsConstructor;
import vngo.dto.CommentDto;
import vngo.entity.Account;
import vngo.service.CommentService;
import vngo.exception.ResourceNotFoundException;
import vngo.repository.AccountRepository;

import org.springframework.http.HttpStatus;

import java.util.List;


@RestController
@CrossOrigin({"http://localhost:3000", "http://192.168.7.181:3000"})
@RequiredArgsConstructor
@RequestMapping("/api/comments")
public class CommentController {
	
	
	private final SimpMessagingTemplate messagingTemplate;

    @Autowired
    private CommentService commentService;
    
    
    @MessageMapping("/blog/{blogId}/comment")
    public void processComment(@Payload CommentDto commentDto) {
        CommentDto savedCommentDto = commentService.addComment(commentDto);

        messagingTemplate.convertAndSend(
            "/topic/blog/" + commentDto.getBlogId(), 
            savedCommentDto 
        );
    }


    // Lấy danh sách bình luận của một bài blog theo blogId
    @GetMapping("/blog/{blogId}")
    public ResponseEntity<?> getCommentsByBlogId(@PathVariable long blogId) {
        try {
            List<CommentDto> comments = commentService.findCommentsByBlogId(blogId);
            return ResponseEntity.ok(comments);
        } catch (ResourceNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Error: " + e.getMessage());
        }
    }

    // Thêm bình luận mới
    @PostMapping
    public ResponseEntity<?> addComment(@RequestBody CommentDto commentDto) {
        try {
    		System.out.println("comDto" + commentDto);
            CommentDto createdComment = commentService.addComment(commentDto);
            return ResponseEntity.status(HttpStatus.CREATED).body(createdComment);
        } catch (ResourceNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Error: " + e.getMessage());
        }
    }

    // Xóa bình luận theo commentId
    @DeleteMapping("/{commentId}")
    public ResponseEntity<?> deleteComment(@PathVariable Long commentId) {
        try {
            commentService.deleteComment(commentId);
            return ResponseEntity.ok("Comment đã được xóa thành công.");
        } catch (ResourceNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Error: " + e.getMessage());
        } catch (AccessDeniedException e) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Error: " + e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error: " + e.getMessage());
        }
    }
}
