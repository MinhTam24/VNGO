package vngo.service;

import java.io.IOException;
import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import vngo.dto.BlogDto;

@Service
public interface BlogService {
	Long CreateBlog(BlogDto blogDto, List<MultipartFile> files) throws IOException;
}
