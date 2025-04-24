package vngo.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import vngo.entity.Comment;

@Repository
public interface CommentRepository extends JpaRepository<Comment, Long> {
    	
    	@Query("SELECT c FROM Comment c WHERE c.blog.id = :blogId ORDER BY c.createAt DESC")
        List<Comment> findCommentsByBlogId(Long blogId);
    	
}
