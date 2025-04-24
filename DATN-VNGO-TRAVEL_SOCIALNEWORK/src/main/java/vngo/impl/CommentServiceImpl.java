package vngo.impl;

import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

import org.apache.http.auth.InvalidCredentialsException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;

import jakarta.transaction.Transactional;
import vngo.dto.CommentDto;
import vngo.entity.Account;
import vngo.entity.Blog;
import vngo.entity.Comment;
import vngo.exception.ResourceNotFoundException;
import vngo.repository.AccountRepository;
import vngo.repository.BlogRepository;
import vngo.repository.CommentRepository;
import vngo.security.Auth;
import vngo.service.CommentService;
import vngo.service.ImageService;
import vngo.ultil.ConstUltil;

@Service
public class CommentServiceImpl implements CommentService {

	@Autowired
	Auth auth;

	@Autowired
	CommentRepository commentRepository;

	@Autowired
	AccountRepository accountRepository;

	@Autowired
	ImageService imageService;

	@Autowired
	BlogRepository blogRepository;

	@Override
	public List<CommentDto> findCommentsByBlogId(long blogId) {
		if (blogId > 0) { 
			List<Comment> listComment = commentRepository.findCommentsByBlogId(blogId);

			if (!listComment.isEmpty()) {
				return listComment.stream().map(comment -> {
					Account account = accountRepository.findById(comment.getCreatedBy().getId())
							.orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy tài khoản"));

					String avatar = imageService.getAvartaByAccountId(account.getId());

					return CommentDto.builder().id(comment.getId()).blogId(comment.getBlog().getId())
							.accountId(comment.getCreatedBy().getId())
							.createdAt(comment.getCreateAt().format(ConstUltil.DATE_TIME_FORMATTER))
							.content(comment.getContent()).isActivated(comment.getIsActivated())
							.fullName(account.getFullName()).avatar(avatar).build();
				}).collect(Collectors.toList()); // Chuyển đổi danh sách các CommentDto
			}
			return Collections.emptyList(); 
		}
		throw new ResourceNotFoundException("Không tìm thấy bình luận cho blog với ID: " + blogId); 
	}

	
	
	@Override
	public CommentDto addComment(CommentDto comDto) {
		Blog blog = blogRepository.findById(comDto.getBlogId())
				.orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy blog" + comDto.getBlogId()));
		Account account = accountRepository.findById(comDto.getAccountId())
				.orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy account" + comDto.getAccountId()));
				
		Comment comment = new Comment();
		comment.setBlog(blog);
		comment.setContent(comDto.getContent());
		comment.setCreateAt(LocalDateTime.now().truncatedTo(ChronoUnit.SECONDS));
		comment.setCreatedBy(account);
		comment.setIsActivated(true);

		Comment savedComment = commentRepository.save(comment);

		comDto.setId(savedComment.getId());
		comDto.setCreatedAt(savedComment.getCreateAt().format(ConstUltil.DATE_TIME_FORMATTER));
		comDto.setBlogOwner(blog.getCreateBy().getId());

		return comDto;
	}

	@Transactional
	@Override
	public void deleteComment(Long commentId) {
		if (commentId > 0) {
			Comment comment = commentRepository.findById(commentId)
					.orElseThrow(() -> new ResourceNotFoundException("không tìm thấy comment"));
			if (comment.getCreatedBy().getId() == auth.getUserId()) {
				commentRepository.delete(comment);
				return;
			} else {
				throw new AccessDeniedException("Bạn không có quyền xóa comment này.");
			}
			
		}
		throw new ResourceNotFoundException("CommentId truyền vào không hợp lợi" + commentId);
	}

}
