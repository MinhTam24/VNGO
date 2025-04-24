package vngo.impl;

import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import vngo.dto.AccountDto;
import vngo.entity.Account;
import vngo.entity.Follow;
import vngo.exception.ResourceNotFoundException;
import vngo.repository.AccountRepository;
import vngo.repository.FollowRepository;
import vngo.service.FollowService;
import vngo.service.ImageService;

@Service
public class FollowServiceImpl implements FollowService{
	
	@Autowired
	FollowRepository followRepository;
	
	@Autowired
	AccountRepository accountRepository;
	
	@Autowired
	ImageService imageService;

	@Override
	public void followAccount(Long followerId, Long followedId) {
		
		if(followRepository.existsByFollowerAndFollowed(followerId, followedId)) {
	        		throw new ResourceNotFoundException("Đã follow rồi");
		}
		Account followed = accountRepository.findById(followedId)
		        .orElseThrow(() -> new RuntimeException("Không tìm thấy tài khoản với ID: " + followedId));
		Account follower = accountRepository.findById(followerId)
		        .orElseThrow(() -> new RuntimeException("Không tìm thấy tài khoản với ID: " + followerId));

		Follow follow = Follow.builder()
				.follower(follower)
				.followed(followed)
        		.followAt(LocalDateTime.now().truncatedTo(ChronoUnit.SECONDS))
        		.build();
        		followRepository.save(follow);
		return;
		
	}

	@Override
	public void unfollowAccount(Long followerId, Long followedId) {
		Follow follow = followRepository.findByFollowerAndFollowed(followerId, followedId);
				if (follow != null) {
					followRepository.delete(follow);
					return;
				}
				
	}

	@Override
	public List<AccountDto> findAccountsNotFollowedBy(Long followerId) {
	    // Lấy danh sách các tài khoản chưa được follower này follow
	    List<Account> accountNotFollowed = followRepository.findAccountsNotFollowedBy(followerId);

	    // Chuyển đổi danh sách Account thành danh sách AccountDto
	    return accountNotFollowed.stream()
	        .map(account -> {
	            // Lấy avatar của từng account
	            String avaString = imageService.getAvartaByAccountId(account.getId());

	            // Tạo AccountDto
	            return AccountDto.builder()
	                .id(account.getId())
	                .fullName(account.getFullName())
	                .avatarUrl(avaString) // Gán avatar vào DTO nếu có
	                .build();
	        })
	        .collect(Collectors.toList());
	}


	@Override
	public List<AccountDto> findAccountsFollowedBy(Long followerId) {
		// danh sách đã follow
		List<Account> followedList = followRepository.findAccountsFollowedBy(followerId);
		return followedList.stream()
				.map(account -> AccountDto.builder()
						.id(account.getId())
						.fullName(account.getFullName())
						.build())
				.collect(Collectors.toList());
	}
	
	@Override
    public boolean checkIfAlreadyFollowed(Long followerId, Long followedId) {
        return followRepository.existsByFollowerAndFollowed(followerId, followedId);
    }

	@Override
	public List<AccountDto> getListFollowedById(Long followerId) {List<Account> followedList = followRepository.findAccountsFollowedBy(followerId);
    // Convert danh sách Account sang AccountDto
    return followedList.stream()
            .map(account -> AccountDto.builder()
                    .id(account.getId())
                    .fullName(account.getFullName())
                    .build())
            .collect(Collectors.toList());
}

}
	    // Sử dụng repository để lấy danh sách followed