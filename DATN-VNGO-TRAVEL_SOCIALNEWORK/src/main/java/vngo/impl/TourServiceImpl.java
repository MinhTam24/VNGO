package vngo.impl;

import java.io.IOException;
import java.lang.StackWalker.Option;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import vngo.dto.BlogDto;
import vngo.dto.LocationDetailDto;
import vngo.dto.LocationDto;
import vngo.dto.TourDto;
import vngo.entity.Account;
import vngo.entity.Image;
import vngo.entity.Location;
import vngo.entity.LocationDetail;
import vngo.entity.Tour;
import vngo.exception.ResourceNotFoundException;
import vngo.repository.AccountRepository;
import vngo.repository.ImageRepository;
import vngo.repository.LocationDetailRepository;
import vngo.repository.TourRepository;
import vngo.security.Auth;
import vngo.service.ImageService;
import vngo.service.LocationDetailService;
import vngo.service.LocationService;
import vngo.service.TourService;
import vngo.ultil.ConstUltil;
import vngo.ultil.ImageType;

@Service
public class TourServiceImpl extends BaseServiceImpl<TourDto, Long> implements TourService {
	@Autowired
	TourRepository tourrepository;

	@Autowired
	LocationDetailRepository locationDetailRepository;

	@Autowired
	LocationService locationService;

	@Autowired
	AccountRepository accountRepository;

	@Autowired
	LocationDetailService locationDetailService;

	@Autowired
	ImageService imageService;

	@Autowired
	Auth auth;

	@Autowired
	CloundinaryServiceImpl cloundinaryServiceImpl;

	@Override
	public long createTour() {
		Account createBy = accountRepository.findById(auth.getUserId())
				.orElseThrow(() -> new ResourceNotFoundException("Tai khoan khon ton tai"));
		Tour newtour = new Tour();
		newtour.setIsActivated(false);
		newtour.setCreateBy(createBy);
		Tour tour = tourrepository.save(newtour);
		return tour.getId();
	}

	@Transactional
	public TourDto updates(TourDto tourdto, List<MultipartFile> files) throws IOException {
		Optional<Tour> tourOpt = tourrepository.findById(tourdto.getId());
		if (tourOpt.isPresent()) {
			Tour tour = tourOpt.get();
			tour.setAddress(tourdto.getAddressTour());
			tour.setDecription(tourdto.getDescriptionTour());
			tour.setModifiedAt(LocalDateTime.now().truncatedTo(ChronoUnit.SECONDS));
			tour.setStartDate(LocalDate.parse(tourdto.getStartDate(), ConstUltil.DATE_FORMATTER));
			tour.setEndDate(LocalDate.parse(tourdto.getEndDate(), ConstUltil.DATE_FORMATTER));
			tour.setExpense(tourdto.getExpense());
			tour.setQuantityMember(tourdto.getQuantityMember());
			tour.setAllowedToApply(tourdto.getAllowedToApply());
			tour.setTitle(tourdto.getTitle());
			tourrepository.save(tour);
			List<String> imageURls = imageService.getImageByTourId(tourdto.getId());
			if (tourdto.getImageUrl() != null) {
				List<String> NewimageURls = tourdto.getImageUrl();
				for (String url : imageURls) {
					if (!NewimageURls.contains(url)) {
						imageService.deleteByImageUrl(url);
					}
				}
			}
			if (files != null && !files.isEmpty()) {
				List<String> ListimageUrl = cloundinaryServiceImpl.upload(files);
				for (String multipartFile : ListimageUrl) {
					Image image = new Image();
					image.setImageId(tour.getId());
					image.setImageType(ImageType.TOUR);
					image.setImageUrl(multipartFile);
					imageService.saveImage(image);
				}
			}
			return tourdto;
		} else {
			throw new ResourceNotFoundException("Không có bài viết");

		}
	}

	@Override
	public long setDataTour(TourDto Dto, List<MultipartFile> files) throws IOException {
		if (Dto.getEndDate() != null && Dto.getStartDate() != null) {
			Tour tour = tourrepository.findById(Dto.getId()).orElseThrow();

			tour.setIsActivated(true);
			tour.setAllowedToApply(Dto.getAllowedToApply());
			tour.setExpense(Dto.getExpense());
			tour.setAddress(Dto.getAddressTour());
			tour.setTitle(Dto.getTitle());
			tour.setDecription(Dto.getDescriptionTour());
			tour.setQuantityMember(Dto.getQuantityMember());
			tour.setCreatedAt(LocalDateTime.now().truncatedTo(ChronoUnit.SECONDS));
			tour.setStartDate(LocalDate.parse(Dto.getStartDate(), ConstUltil.DATE_FORMATTER));
			tour.setEndDate(LocalDate.parse(Dto.getEndDate(), ConstUltil.DATE_FORMATTER));

			tourrepository.save(tour);

			// upload and save image
			if (files != null && !files.isEmpty()) {
				List<String> ListimageUrl = cloundinaryServiceImpl.upload(files);
				for (String iamgeUrl : ListimageUrl) {
					Image image = new Image();
					image.setImageId(tour.getId());
					image.setImageType(ImageType.TOUR);
					image.setImageUrl(iamgeUrl);
					imageService.saveImage(image);
				}
			}
			return tour.getId();
		} else {
			throw new ResourceNotFoundException("Khong co ngay ket thuc va ng");
		}

	}

	@Override
	public void insert(TourDto tourdto) {

	}

	@Override
	public TourDto update(TourDto tourdto) {
		Optional<Tour> tourOpt = tourrepository.findById(tourdto.getId());
		if (tourOpt.isPresent()) {
			Tour tour = tourOpt.get();
			tour.setDecription(tourdto.getDescriptionTour());
			tour.setModifiedAt(LocalDateTime.now().truncatedTo(ChronoUnit.SECONDS));
			tour.setStartDate(LocalDate.parse(tourdto.getStartDate(), ConstUltil.DATE_FORMATTER));
			tour.setEndDate(LocalDate.parse(tourdto.getEndDate(), ConstUltil.DATE_FORMATTER));
			tour.setExpense(tourdto.getExpense());
			tour.setQuantityMember(tourdto.getQuantityMember());
			tour.setAllowedToApply(tourdto.getAllowedToApply());
			tour.setTitle(tourdto.getTitle());
			tourrepository.save(tour);
			return tourdto;
		} else {
			throw new ResourceNotFoundException("Không có tài khoản");
		}
	}

	@Override
	public boolean delete(Long id) {
		Optional<Tour> tour = tourrepository.findById(id);
		if (tour.isPresent()) {
			locationService.deleteLocationsByTourId(id);
			tourrepository.deleteById(id);
			return true;
		} else {
			return false;
		}
	}

	@Override
	public TourDto getById(Long id) {

		Optional<Tour> tourOpt = tourrepository.findById(id);
		if (tourOpt.isPresent()) {
			Tour tour = tourOpt.get();
			
			Optional<Account> acc = accountRepository.findById(tour.getCreateBy().getId());

			// lấy list locationDto bằng tour id
			List<LocationDto> listLocationDto = locationService.getLocationByTourId(id);

			// lấy list Iamge bằng tour id
			List<String> listImageUrl = imageService.getImageByTourId(id);

			listLocationDto.forEach(locationDto -> {
				LocationDetailDto locationDetailDto = locationDetailService.getLocationDetailByTourAndLocation(id,
						locationDto.getId());
				locationDto.setLocationDetailDto(locationDetailDto);
			});

			TourDto tourdto = TourDto.builder().id(tour.getId()).descriptionTour(tour.getDecription())
					.createBy(tour.getCreateBy().getId())
					.createdAt(tour.getCreatedAt().format(ConstUltil.DATE_TIME_FORMATTER))
					.modifiedAt(Optional.ofNullable(tour.getModifiedAt())
							.map(modifiedAt -> modifiedAt.format(ConstUltil.DATE_TIME_FORMATTER)).orElse(null))
					.startDate(tour.getStartDate().format(ConstUltil.DATE_FORMATTER))
					.endDate(tour.getEndDate().format(ConstUltil.DATE_FORMATTER)).expense(tour.getExpense())
					.ownerName(acc.get().getFullName())
					.addressTour(tour.getAddress()).quantityMember(tour.getQuantityMember())
					.allowedToApply(tour.getAllowedToApply()).title(tour.getTitle()).LocationDto(listLocationDto)
					.imageUrl(listImageUrl).build();
			return tourdto;
		} else {
			throw new ResourceNotFoundException("Không tìm thấy chuyến đi nào trong hệ thống");
		}
	}

	@Override
	public List<TourDto> getAll() {
		List<Tour> tourList = tourrepository.findAll();
		if (tourList.isEmpty()) {
			throw new ResourceNotFoundException("Không tìm thấy chuyến đi nào trong hệ thống");
		} else {
			return tourList.stream().filter(tour -> tour.getIsActivated() == true).map(tour -> {
				List<String> listImageUrl = imageService.getImageByTourId(tour.getId());
				return TourDto.builder().id(tour.getId()).descriptionTour(tour.getDecription())
						.createBy(tour.getCreateBy().getId())
						.createdAt(tour.getCreatedAt().format(ConstUltil.DATE_TIME_FORMATTER))
						.modifiedAt(Optional.ofNullable(tour.getModifiedAt())
								.map(modifiedAt -> modifiedAt.format(ConstUltil.DATE_TIME_FORMATTER)).orElse(null))
						.startDate(tour.getStartDate().format(ConstUltil.DATE_FORMATTER))
						.endDate(tour.getEndDate().format(ConstUltil.DATE_FORMATTER)).addressTour(tour.getAddress())
						.expense(tour.getExpense()).quantityMember(tour.getQuantityMember())
						.allowedToApply(tour.getAllowedToApply()).title(tour.getTitle()).imageUrl(listImageUrl)

						.build();

			}).toList();
		}
	}

	public List<TourDto> getListTourByCreateBY(long id) {
		Account createBy = accountRepository.findById(id)
				.orElseThrow(() -> new ResourceNotFoundException("Khong tim thay tai khoan"));
		List<Tour> tourList = createBy.getTour();
		if (tourList.isEmpty()) {
			throw new ResourceNotFoundException("Không tìm thấy chuyến đi nào trong hệ thống");
		} else {
			return tourList.stream().filter(tour -> tour.getIsActivated() == true).map(tour -> {
				List<String> listImageUrl = imageService.getImageByTourId(tour.getId());
				return TourDto.builder().id(tour.getId()).descriptionTour(tour.getDecription())
						.createBy(tour.getCreateBy().getId())
						.createdAt(tour.getCreatedAt().format(ConstUltil.DATE_TIME_FORMATTER))
						.modifiedAt(Optional.ofNullable(tour.getModifiedAt())
								.map(modifiedAt -> modifiedAt.format(ConstUltil.DATE_TIME_FORMATTER)).orElse(null))
						.startDate(tour.getStartDate().format(ConstUltil.DATE_FORMATTER))
						.endDate(tour.getEndDate().format(ConstUltil.DATE_FORMATTER)).addressTour(tour.getAddress())
						.expense(tour.getExpense()).quantityMember(tour.getQuantityMember())
						.allowedToApply(tour.getAllowedToApply()).title(tour.getTitle()).imageUrl(listImageUrl)

						.build();

			}).toList();
		}
	}
}
