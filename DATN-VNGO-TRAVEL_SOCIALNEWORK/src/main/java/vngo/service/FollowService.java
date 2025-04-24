package vngo.service;

import java.util.List;

import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Service;

import vngo.dto.AccountDto;
import vngo.dto.FollowDto;
import vngo.entity.Account;

@Service
public interface FollowService {
	void followAccount(Long followerId, Long followedId);
    void unfollowAccount(Long followerId, Long followedId);
    List<AccountDto> findAccountsNotFollowedBy(Long followerId);// chưa follow
    List<AccountDto> findAccountsFollowedBy(Long followerId);// đã follow
	boolean checkIfAlreadyFollowed(Long followerId, Long followedId);
	List<AccountDto> getListFollowedById(Long followerId);

}