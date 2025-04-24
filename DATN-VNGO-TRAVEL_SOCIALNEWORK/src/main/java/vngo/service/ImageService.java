package vngo.service;

import java.util.List;

import org.springframework.stereotype.Service;

import vngo.entity.Image;
import vngo.ultil.ImageType;

@Service
public interface ImageService {
	void saveImage(Image image);
	List<String> getImageByblogtId(Long blogId);
	List<String> getImageByAccountId(Long accountId);
	List<String> getImageByTourId(Long tourId);
	List<String> getImageByLocationId(Long locationId); 
	String getAvartaByAccountId(Long accountId);
	void deleteByImageUrl(String url);

}
