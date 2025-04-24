package vngo.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import vngo.entity.Blog;

@Repository
public interface BlogRepository extends JpaRepository<Blog, Long> {
	List<Blog> findByCreateById(Long id);
}
