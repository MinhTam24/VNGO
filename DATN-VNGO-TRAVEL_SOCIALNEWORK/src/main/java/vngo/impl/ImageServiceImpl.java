package vngo.impl;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import jakarta.transaction.Transactional;
import vngo.entity.Image;
import vngo.exception.ResourceNotFoundException;
import vngo.repository.ImageRepository;
import vngo.service.ImageService;
import vngo.ultil.ImageType;

@Service
public class ImageServiceImpl implements ImageService {
	@Autowired
	ImageRepository imageRepository;
	
	
	@Override
	public void saveImage(Image image) {
		imageRepository.save(image);
	}

	@Override
	public List<String> getImageByblogtId(Long blogId) {
		List<String> listImageUrl = imageRepository.findImageUrlByImageIdAndImageType(blogId, ImageType.BLOG);
		if(listImageUrl != null) {
			return listImageUrl;
		}
		throw new ResourceNotFoundException("NO IMAGE");
	}

	@Override
	public List<String> getImageByAccountId(Long accountId) {
		List<String> listImageUrl = imageRepository.findImageUrlByImageIdAndImageType(accountId, ImageType.ACCOUNT);
		if(listImageUrl != null) { 
			return listImageUrl;
		}
		throw new ResourceNotFoundException("NO IMAGE");
	}
	
	
	@Override
	public String getAvartaByAccountId(Long accountId) {
		List<String> listImageUrl = imageRepository.findImageUrlByImageIdAndImageType(accountId, ImageType.AVATAR);
		if(!listImageUrl.isEmpty()) {
			return listImageUrl.get(0);
		}
		return "	https://res.cloudinary.com/dopwq7ciu/image/upload/v1734164002/user-avatar_bbham5.jpg\r\n"
				+ "";
	}

	
	
	@Override
	public List<String> getImageByTourId(Long tourId) {
		List<String> listImageUrl = imageRepository.findImageUrlByImageIdAndImageType(tourId, ImageType.TOUR);
		if(listImageUrl != null) {
			return listImageUrl;
		}
		throw new ResourceNotFoundException("NO IMAGE");
	}

	@Override
	public List<String> getImageByLocationId(Long locationId) {
		List<String> listImageUrl = imageRepository.findImageUrlByImageIdAndImageType(locationId, ImageType.LOCATION);
		if(listImageUrl != null) {
			return listImageUrl;
		}
		throw new ResourceNotFoundException("NO IMAGE");
	}

	@Transactional
	@Override
	public void deleteByImageUrl(String url) {
		imageRepository.deleteByImageUrl(url);
	}

	
}
