package vngo.impl;

import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.Collections;
import java.util.List;

import org.apache.http.auth.InvalidCredentialsException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.relational.core.sql.Like;
import org.springframework.stereotype.Service;

import jakarta.transaction.Transactional;
import vngo.dto.LikeDto;
import vngo.entity.Account;
import vngo.entity.Blog;
import vngo.entity.Likes;
import vngo.exception.ResourceNotFoundException;
import vngo.repository.AccountRepository;
import vngo.repository.BlogRepository;
import vngo.repository.LikesRepository;
import vngo.service.LikesService;
import vngo.ultil.ConstUltil;

@Service
public class LikeServiceImpl implements LikesService {

	@Autowired
	BlogRepository blogRepository;

	@Autowired
	AccountRepository accountRepository;

	@Autowired
	LikesRepository likesRepository;

	@Override
	public List<LikeDto> getListLikeByBlogId(Long id) {
		if (id != null) {
			List<Likes> listLike = likesRepository.findByBlogId(id);
			if (!listLike.isEmpty()) {
				return listLike.stream()
						.map(like -> LikeDto.builder().id(like.getId()).blog(like.getBlog().getId())
								.createdBy(like.getCreatedBy())
								.likeAt(like.getLikeAt().format(ConstUltil.DATE_TIME_FORMATTER)).build())
						.toList();
			} else {
				return Collections.emptyList();
			}
		}
		throw new ResourceNotFoundException("idBlog truyền vào không hợp lệ: " + id);
	}

	@Override
	public boolean isLiked(Long blogId, Long accountId) {
		if (blogId != null && accountId != null) {
			return likesRepository.existsByBlogIdAndCreatedById(blogId, accountId);
		}
		throw new ResourceNotFoundException(
				"id Blog truyền vào không hợp lệ: " + "blogID" + blogId + "account" + accountId);
	}

	@Override
	public long countLikeByBlogId(Long id) {
		if (id != null) {
			return likesRepository.countByBlogId(id);
		}
		throw new ResourceNotFoundException("idBlog truyền vào không hợp lệ: " + id);
	}

	@Override
	public long addLike(Long blogId, Long accountId) {
		if (blogId != null || accountId != null) {
			Blog blog = blogRepository.findById(blogId)
					.orElseThrow(() -> new vngo.exception.InvalidCredentialsException("Không tìm thấy Blog " + blogId));

			Account acc = accountRepository.findById(accountId)
					.orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy account"));

			Likes like = new Likes();
			like.setBlog(blog);	
			like.setCreatedBy(acc);
			like.setLikeAt(LocalDateTime.now().truncatedTo(ChronoUnit.SECONDS));
			like.setIs_activated(true);
			likesRepository.save(like);	
			return like.getCreatedBy().getId(); 
		}
		throw new ResourceNotFoundException(
				"id Blog truyền vào không hợp lệ: " + "blogID" + blogId + "account" + accountId);
	}
	
	@Transactional
	@Override
	public void removeLike(Long blogId, Long accountId) {
		if (blogId != null && accountId != null) {
			Blog blog = blogRepository.findById(blogId)
					.orElseThrow(() -> new vngo.exception.InvalidCredentialsException("Không tìm thấy Blog " + blogId));

			Account acc = accountRepository.findById(accountId)
					
					.orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy account"));
			if(this.isLiked(blogId, accountId)) {
				likesRepository.deleteByBlogIdAndCreatedById(blogId, accountId);
			}
			return;
		}
		throw new ResourceNotFoundException(
				"id Blog truyền vào không hợp lệ: " + "blogID" + blogId + "account" + accountId);
	}

}
