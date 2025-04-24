package vngo.service;

import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;

import vngo.dto.AccountDto;
import vngo.dto.LoginDto;
import vngo.dto.ProfileDto;
import vngo.entity.Account;

@Service
public interface AccountService{
	String login(LoginDto loginDto);
	AccountDto getAccountByEmail(String email);
	List<AccountDto> getContactWith(Long id);
	List<AccountDto> searchAccount(String searchKeyWord);
	ProfileDto profile(Long id);
	boolean updateHobbyForAccount(Long accountId, List<Long> hobbyId, boolean isAdd);
	void addHobbyToAccount(Long accountId, List<Long> hobbyId);
	void removeHobbyFromAccount(Long accountId, List<Long> hobbyId);
}
