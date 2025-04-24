package vngo.service;

import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

@Service
public interface CloudinaryService {
	public List<String> upload(List<MultipartFile> file) throws java.io.IOException;
}
