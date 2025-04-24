package vngo.service;

import java.util.List;

import org.springframework.stereotype.Service;

import vngo.dto.CommentDto;
import vngo.entity.Comment;

@Service
public interface CommentService {
	List<CommentDto> findCommentsByBlogId(long blogId);
	CommentDto addComment(CommentDto comDto);
	void deleteComment(Long commentId);
}
