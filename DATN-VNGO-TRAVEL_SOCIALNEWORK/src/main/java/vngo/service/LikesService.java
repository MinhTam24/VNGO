package vngo.service;

import java.util.List;

import org.springframework.stereotype.Service;

import vngo.dto.LikeDto;

@Service
public interface LikesService {
	List<LikeDto> getListLikeByBlogId(Long id);
	long countLikeByBlogId(Long id);
	long addLike(Long blogId, Long accountId);
	void removeLike (Long blogId, Long accountId);
    boolean isLiked(Long blogId, Long accountId); 

}
