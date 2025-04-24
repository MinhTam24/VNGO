package vngo.impl;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;

import io.jsonwebtoken.io.IOException;
import vngo.service.CloudinaryService;

@Service
public class CloundinaryServiceImpl implements CloudinaryService {
	@Autowired
	Cloudinary cloudinary;
	
	@Override
	public List<String> upload(List<MultipartFile> files) throws java.io.IOException {
		List<String> imageUrls = new ArrayList();
		for (MultipartFile file : files) {
			try {
				Map<String, Object> uploadOptions = ObjectUtils.asMap("folder", "VNGO");
				Map<String, Object> data = cloudinary.uploader().upload(file.getBytes(), uploadOptions);
				imageUrls.add(data.get("url").toString());
			} catch (Exception e) {
				throw new RuntimeException("Lỗi khi upload ảnh: " + file.getOriginalFilename(), e);
			}
		}
		return imageUrls;
	}

}
