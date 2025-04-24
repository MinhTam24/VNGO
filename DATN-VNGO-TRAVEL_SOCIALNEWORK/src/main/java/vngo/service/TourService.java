package vngo.service;

import java.io.IOException;
import java.util.List;


import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import vngo.dto.TourDto;

@Service
public interface TourService {
	long createTour();
	long setDataTour(TourDto Dto, List<MultipartFile> files) throws IOException;

}
