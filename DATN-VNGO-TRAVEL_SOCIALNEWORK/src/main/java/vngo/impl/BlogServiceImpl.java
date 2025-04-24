package vngo.impl;

import java.io.IOException;
import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.Iterator;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.annotation.CreatedBy;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import io.jsonwebtoken.lang.Collections;
import vngo.dto.BlogDto;
import vngo.entity.Account;
import vngo.entity.Blog;
import vngo.entity.Image;
import vngo.entity.Tour;
import vngo.exception.ResourceNotFoundException;
import vngo.repository.AccountRepository;
import vngo.repository.BlogRepository;
import vngo.repository.TourRepository;
import vngo.security.Auth;
import vngo.service.BlogService;
import vngo.service.ImageService;
import vngo.ultil.ConstUltil;
import vngo.ultil.ImageType;

@Service
public class BlogServiceImpl extends BaseServiceImpl<BlogDto, Long> implements BlogService {

	@Autowired
	AccountRepository accountRepository;

	@Autowired
	BlogRepository blogRepository;

	@Autowired
	TourRepository tourRepository;

	@Autowired
	ImageService imageService;

	@Autowired
	CloundinaryServiceImpl cloundinaryServiceImpl;

	@Autowired
	Auth auth;

	@Override
	public void insert(BlogDto T) {
		// TODO Auto-generated method stub

	}

	@Transactional
	public BlogDto updates(BlogDto blogDto, List<MultipartFile> files) throws IOException {
		System.out.println("ID" + blogDto.getId());
		Optional<Blog> blogOpt = blogRepository.findById(blogDto.getId());
		if (blogOpt.isPresent()) {
			Blog blog = blogOpt.get();
			blog.setDecription(blogDto.getDecription());
			blogRepository.save(blog);
			List<String> imageURls = imageService.getImageByblogtId(blogDto.getId());
			List<String> NewimageURls = blogDto.getImageUrl();
			// nếu url cũ ko có trong url mới thì xóa
			for (String url : imageURls) {
				if (!NewimageURls.contains(url)) {
					imageService.deleteByImageUrl(url);
				}
			}
			if (files != null && !files.isEmpty()) {
				List<String> ListimageUrl = cloundinaryServiceImpl.upload(files);
				for (String multipartFile : ListimageUrl) {
					Image image = new Image();
					image.setImageId(blog.getId());
					image.setImageType(ImageType.BLOG);
					image.setImageUrl(multipartFile);
					imageService.saveImage(image);
				}	
			}

			return blogDto;
		} else {
			throw new ResourceNotFoundException("Không có bài viết");
		}
	}

	@Override
	public boolean delete(Long id) {
		if (getById(id) != null) {
			blogRepository.deleteById(id);
			return true;
		} else {
			throw new ResourceNotFoundException("Không tìm thấy chuyến đi nào trong hệ thống để xóa");
		}
	}

	@Override
	public BlogDto getById(Long id) {
		Optional<Blog> blogOpt = blogRepository.findById(id);
		if (blogOpt.isPresent()) {
			Blog blog = blogOpt.get();
			List<String> listImageUrl = imageService.getImageByblogtId(id);
			BlogDto blogDto = BlogDto.builder().id(blog.getId()).createdBy(blog.getCreateBy().getId())
					.createdAt(blog.getCreatedAt().format(ConstUltil.DATE_TIME_FORMATTER))
					.isActivated(blog.getIsActivated()).decription(blog.getDecription())
					.tour(blog.getTour() != null ? blog.getTour().getId() : null).imageUrl(listImageUrl).build();
			return blogDto;
		}
		throw new ResourceNotFoundException("Không có bài viết");
	}

	@Override
	public List<BlogDto> getAll() {

		List<Blog> blogList = blogRepository.findAll();
		if (blogList.isEmpty()) {
			throw new ResourceNotFoundException("Không tìm thấy bài đăng nào trong hệ thống");
		} else {
			return blogList.stream().map(blog -> {
				List<String> listImageUrl = imageService.getImageByblogtId(blog.getId());
				return BlogDto.builder().id(blog.getId()).createdBy(blog.getCreateBy().getId())
						.createdAt(blog.getCreatedAt().format(ConstUltil.DATE_TIME_FORMATTER))
						.isActivated(blog.getIsActivated()).decription(blog.getDecription())
						.tour(blog.getTour() != null ? blog.getTour().getId() : null).imageUrl(listImageUrl).build();
			}).toList();
		}
	}

	@Override
	public Long CreateBlog(BlogDto blogDto, List<MultipartFile> files) throws IOException {
		Optional<Account> accountOpt = accountRepository.findById(auth.getUserId());
		if (accountOpt.isPresent()) {
			// Kiểm tra xem tour có tồn tại không
			Optional<Tour> tourOpt = Optional.empty();
			if (blogDto.getTour() != null) {
				tourOpt = tourRepository.findById(blogDto.getTour());
			}

			Blog blog = Blog.builder().createdAt(LocalDateTime.now().truncatedTo(ChronoUnit.SECONDS)).isActivated(true)
					.decription(blogDto.getDecription()) // Ghi chính tả đúng là "description"
					.createBy(accountOpt.get()).tour(tourOpt.orElse(null)) // Nếu không có tour, giá trị này sẽ là null
					.build();
			blogRepository.save(blog);

			if (files != null && !files.isEmpty()) {
				// Upload hình ảnh nếu có
				List<String> ListimageUrl = cloundinaryServiceImpl.upload(files);
				for (String iamgeUrl : ListimageUrl) {
					Image image = new Image();
					image.setImageId(blog.getId());
					image.setImageType(ImageType.BLOG);
					image.setImageUrl(iamgeUrl);
					imageService.saveImage(image);
				}
			}
			return blog.getId();
		} else {
			throw new ResourceNotFoundException("Người dùng không tồn tại");
		}
	}

	public List<BlogDto> getAllPage(int page, int size) {
	    // Sắp xếp theo ngày tạo mới nhất (DESC)
	    Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Order.desc("createdAt")));
	    
	    // Lấy dữ liệu với trang và sắp xếp
	    Page<Blog> blogPage = blogRepository.findAll(pageable);

	    // Nếu không có dữ liệu trong trang
	    if (blogPage.isEmpty()) {
	        return null; // Hoặc có thể trả về một danh sách rỗng nếu muốn
	    } else {
	        // Nếu có dữ liệu, chuyển đổi Blog thành BlogDto
	        return blogPage.stream().map(blog -> {
	            List<String> listImageUrl = imageService.getImageByblogtId(blog.getId());
	            String avatarUrl = imageService.getAvartaByAccountId(blog.getCreateBy().getId());
	            return BlogDto.builder().id(blog.getId())
	                    .createdBy(blog.getCreateBy().getId())
	                    .fullName(blog.getCreateBy().getFullName())
	                    .avatarUrl(avatarUrl)
	                    .createdAt(blog.getCreatedAt().format(ConstUltil.DATE_TIME_FORMATTER))
	                    .isActivated(blog.getIsActivated())
	                    .decription(blog.getDecription())
	                    .tour(blog.getTour() != null ? blog.getTour().getId() : null)
	                    .imageUrl(listImageUrl)
	                    .build();
	        }).collect(Collectors.toList());
	    }
	}

	public List<BlogDto> getAllBlogByCreateBy(Long id){
		Account createBy = accountRepository.findById(id)
				.orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy tài khoản"));
		List<Blog> blogList = createBy.getBlog();
		String avtUrl = imageService.getAvartaByAccountId(createBy.getId());
		if(blogList.isEmpty()) {
			throw new ResourceNotFoundException("Không tìm thất bài viết nào");
		} else {
			return blogList.stream().map(blog -> {
				List<String> listImageUrl = imageService.getImageByblogtId(blog.getId());
				return BlogDto.builder()
						.id(blog.getId())
						.isActivated(blog.getIsActivated())
						.decription(blog.getDecription())
						.fullName(blog.getCreateBy().getFullName())
						.createdBy(blog.getCreateBy().getId())
						.createdAt(blog.getCreatedAt().format(ConstUltil.DATE_TIME_FORMATTER))
						.imageUrl(listImageUrl)
						.avatarUrl(avtUrl)
						.build();
			}).toList();
		}
	}

	@Override
	public BlogDto update(BlogDto model) {
		// TODO Auto-generated method stub
		return null;
	}

}
