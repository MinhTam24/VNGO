package vngo.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import jakarta.transaction.Transactional;
import vngo.entity.Likes;

@Repository
public interface LikesRepository extends JpaRepository<Likes, Long> {
	
	@Transactional
	void deleteByBlogIdAndCreatedById(Long blogId, Long accountId);

	List<Likes> findByBlogId(long id);

	long countByBlogId(long id);
	
    boolean existsByBlogIdAndCreatedById(Long blogId, Long accountId);


}
