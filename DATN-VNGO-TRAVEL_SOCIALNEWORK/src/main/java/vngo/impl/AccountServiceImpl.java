package vngo.impl;

import java.io.Console;
import java.io.IOException;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.Objects;
import java.util.Optional;

import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import vngo.dto.AccountDto;
import vngo.dto.LoginDto;
import vngo.dto.ProfileDto;
import vngo.dto.RegisterDto;
import vngo.dto.ResetPasswordRequest;
import vngo.entity.Account;
import vngo.entity.Hobby;
import vngo.entity.Image;
import vngo.exception.AccountAlreadyExistsException;
import vngo.exception.InvalidCredentialsException;
import vngo.exception.ResourceNotFoundException;
import vngo.repository.AccountRepository;
import vngo.repository.FollowRepository;
import vngo.repository.HobbyRepository;
import vngo.security.Auth;
import vngo.security.CustomUserDetails;
import vngo.security.JwtService;
import vngo.service.AccountService;
import vngo.service.HobbyService;
import vngo.service.ImageService;
import vngo.ultil.AccountStatus;
import vngo.ultil.ConstUltil;
import vngo.ultil.ImageType;

@Service
public class AccountServiceImpl extends BaseServiceImpl<AccountDto, Long> implements AccountService {
	@Autowired
	AccountRepository accountRepository;
	
	@Autowired
	PasswordEncoder passwordEncoder;
	
	@Autowired
	HobbyRepository hobbyRepository;
	
	@Autowired
	HobbyService hobbyService;
	
	@Autowired
	FollowRepository followRepository;
	
	
	@Autowired
	ModelMapper modelMapper;

	@Autowired
	AuthenticationManager authenticationManager;

	@Autowired
	JwtService jwtService;

	@Autowired
	CloundinaryServiceImpl cloundinaryServiceImpl;

	@Autowired
	ImageService imageService;

	@Autowired
	Auth auth;

	@Override
	public String login(LoginDto loginDto) {
		try {
			Authentication authentication = authenticationManager
					.authenticate(new UsernamePasswordAuthenticationToken(loginDto.getEmail(), loginDto.getPassWord()));

			if (authentication.isAuthenticated()) {

				// Lấy đối tượng CustomUserDetails sau khi xác thực
				CustomUserDetails customUserDetails = (CustomUserDetails) authentication.getPrincipal();

				// Tạo token JWT
				String token = jwtService.createToken(customUserDetails.getUsername(), customUserDetails.getUserId());

				return token;
			} else {
				throw new InvalidCredentialsException("Invalid credentials");
			}
		} catch (BadCredentialsException e) {
			throw new InvalidCredentialsException ("Account not found " + e);
		} catch (UsernameNotFoundException e) {
			throw new InvalidCredentialsException ("Account not found: " + e.getMessage());
		} catch (Exception e) {
			throw new RuntimeException("An error occurred during login: " + e.getMessage());
		}
	}

	public void SignUp(RegisterDto registerDto) {
		Optional<Account> accountOtp = accountRepository.findByEmail(registerDto.getEmail());
		if (accountOtp.isPresent()) {
			throw new AccountAlreadyExistsException("Account with emai" + registerDto.getEmail() + "already exists");
		} else {
			Account account = modelMapper.map(registerDto, Account.class);
			account.setStatus(AccountStatus.OFFLINE);
			account.setCreateDate(LocalDateTime.now().truncatedTo(ChronoUnit.SECONDS));
			account.setBirthday(LocalDate.parse(registerDto.getBirthday()));
			account.setPassWord(passwordEncoder.encode(registerDto.getPassWord()));
			accountRepository.save(account);
		}
	}

	public String setAvartar(List<MultipartFile> multipartFiles) throws IOException {
		Optional<Account> account = accountRepository.findById(auth.getUserId());
		if (account.isPresent()) {
			if (multipartFiles == null || multipartFiles.isEmpty()) {
				throw new IllegalArgumentException("No files provided for avatar upload.");
			}
			List<String> avatarUrl = cloundinaryServiceImpl.upload(multipartFiles);
			if (avatarUrl == null || avatarUrl.isEmpty()) {
				throw new IOException("Failed to upload avatar.");
			}
			Image image = new Image();
			image.setImageUrl(avatarUrl.get(0));
			image.setImageId(auth.getUserId());
			image.setUploadAt(LocalDateTime.now().truncatedTo(ChronoUnit.SECONDS));
			image.setImageType(ImageType.AVATAR);
			imageService.saveImage(image);
			;
			return avatarUrl.get(0);
		}
		throw new ResourceNotFoundException("No Account with Id" + auth.getUserId());
	}

	@Override
	public AccountDto getAccountByEmail(String email) {
		Optional<Account> account = accountRepository.findByEmail(email);
		if (account.isPresent()) {
			AccountDto accountDto = modelMapper.map(account.get(), AccountDto.class);
			return accountDto;
		}
		throw new ResourceNotFoundException("Account not found with email: " + email);
	}

	@Override
	public void insert(AccountDto accountDto) {

	}

	@Override
	public AccountDto update(AccountDto accountDto) {
		 // Tìm tài khoản theo ID
	    Optional<Account> accountOptional = accountRepository.findById(accountDto.getId());
	    if (accountOptional.isPresent()) {
	        Account existingAccount = accountOptional.get();

	        // Cập nhật các trường cần thiết từ DTO
	        if (Objects.nonNull(accountDto.getEmail()) && !accountDto.getEmail().isEmpty()) {
	            existingAccount.setEmail(accountDto.getEmail());
	        }
	        if (Objects.nonNull(accountDto.getFullName()) && !accountDto.getFullName().isEmpty()) {
	            existingAccount.setFullName(accountDto.getFullName());
	        }
	        if (Objects.nonNull(accountDto.getPhone()) && !accountDto.getPhone().isEmpty()) {
	            existingAccount.setPhone(accountDto.getPhone());
	        }
	        if (Objects.nonNull(accountDto.getAddress()) && !accountDto.getAddress().isEmpty()) {
	            existingAccount.setAddress(accountDto.getAddress());
	        }
	        if (Objects.nonNull(accountDto.getBirthday()) && !accountDto.getBirthday().isEmpty()) {
	            existingAccount.setBirthday(LocalDate.parse(accountDto.getBirthday()));
	        }
	        if (Objects.nonNull(accountDto.getGender())) {
	            existingAccount.setGender(accountDto.getGender());
	        }

	        // Lưu thay đổi vào cơ sở dữ liệu
	        accountRepository.save(existingAccount);

	        // Chuyển đổi lại thành DTO để trả về
	        return modelMapper.map(existingAccount, AccountDto.class);
	    }

	    // Ném lỗi nếu không tìm thấy tài khoản
	    throw new ResourceNotFoundException("Account not found with ID: " + accountDto.getId());
	}

	@Override
	public boolean delete(Long id) {
		Optional<Account> account = accountRepository.findById(id);
		if (account.isPresent()) {
			accountRepository.delete(account.get());
		}
		throw new ResourceNotFoundException("Account not found");
	}

	@Override
	public AccountDto getById(Long id) {
		Optional<Account> account = accountRepository.findById(id);
		if (account.isPresent()) {
			Account acc = account.get();
			AccountDto accountDto = modelMapper.map(acc, AccountDto.class);
			return accountDto;
		}
		throw new ResourceNotFoundException("Account not found with Id: " + id);
	}
	

	@Override
	public List<AccountDto> getAll() {
		List<Account> listAccount = accountRepository.findAll();
		if (!listAccount.isEmpty()) {
			List<AccountDto> listaccAccountOnlineDtos = listAccount.stream()
					.map(account -> {
						AccountDto accountDto = modelMapper.map(account, AccountDto.class);
						String avatarUrl = imageService.getAvartaByAccountId(account.getId());
	                    accountDto.setAvatarUrl(avatarUrl); 
	                    return accountDto;
					}).toList();
			return listaccAccountOnlineDtos;
		}
		throw new ResourceNotFoundException("ListAccount is Null");
	}
	
	@Override
	public List<AccountDto> getContactWith(Long id) {
	    List<Account> listContact = accountRepository.findContactWithAccount(id);
	    System.out.println("listContact" + listContact);
	    if (listContact != null) {
	        List<AccountDto> listAccountDtos = listContact.stream()
	                .map(account -> {
	                    AccountDto accountDto = modelMapper.map(account, AccountDto.class);
	        	        String avatarUrl = imageService.getAvartaByAccountId(account.getId());
	                    accountDto.setAvatarUrl(avatarUrl); 
	                    return accountDto;
	                }).toList();
	        return listAccountDtos;
	    }
	    return null; // Nếu danh sách liên hệ là null, trả về null
	}

	@Override
	public List<AccountDto> searchAccount(String searchKeyWord) {
		List<Account> listContact = accountRepository.searchAccounts(searchKeyWord);
	    System.out.println("listContact" + listContact);
	    if (listContact != null) {
	        List<AccountDto> listAccountDtos = listContact.stream()
	                .map(account -> {
	                    AccountDto accountDto = modelMapper.map(account, AccountDto.class);
	        	        String avatarUrl = imageService.getAvartaByAccountId(account.getId());
	                    accountDto.setAvatarUrl(avatarUrl); 
	                    return accountDto;
	                }).toList();
	        return listAccountDtos;
	    }
	    return null; 
	}

	
	public Boolean resetPassword(ResetPasswordRequest request){
		try {
			if (request.getEmail() == null || request.getEmail().trim().isEmpty()) {
		        throw new IllegalArgumentException("Email không được để trống!");
		    }
		    if (request.getNewPassword() == null || request.getNewPassword().trim().isEmpty()) {
		        throw new IllegalArgumentException("Mật khẩu không được để trống!");
		    }
			Account account = accountRepository.findByEmail(request.getEmail()).orElseThrow(() -> new InvalidCredentialsException("Không có tài khoản"));
			account.setPassWord(passwordEncoder.encode(request.getNewPassword()));
			accountRepository.save(account);
			return true;
		} catch (Exception e) {
			throw new BadCredentialsException("Lỗi đổi mật khẩu");
		}
	}

	@Override
	public ProfileDto profile(Long id) {
		System.out.println(id);
		Optional<Account> accountOptional = accountRepository.findById(id);

		if (accountOptional.isPresent()) {
			Account account = accountOptional.get();
			
			String avatarUrl = imageService.getAvartaByAccountId(id);
			
			ProfileDto profileDto = modelMapper.map(account, ProfileDto.class);

			if (account.getBirthday() != null) {
	            profileDto.getBirthday().format(ConstUltil.DATE_FORMATTER);
	        } else {
	            profileDto.setBirthday(null);
	        }
			
			profileDto.setAvatarUrl(avatarUrl);
			profileDto.setUserHobbies(account.getHobbys());
			profileDto.setFollower(account.getFollower());
			return profileDto;
		}

		throw new ResourceNotFoundException("Không tìm thấy tài khoản có ID: " + id);
	}

	@Override
	public boolean updateHobbyForAccount(Long accountId, List<Long> hobbyId, boolean isAdd) {
	    // Kiểm tra tài khoản
	    Account account = accountRepository.findById(accountId)
	        .orElseThrow(() -> new ResourceNotFoundException("Account not found with id: " + accountId));

	    // Kiểm tra danh sách hobbies
	    List<Hobby> hobbies = hobbyRepository.findAllById(hobbyId);
	    if (hobbies.size() != hobbyId.size()) {
	        throw new ResourceNotFoundException("One or more hobbies not found");
	    }

	    boolean isUpdated;
	    if (isAdd) {
	        // Thêm hobbies vào tài khoản
	        isUpdated = account.getHobbys().addAll(hobbies);
	    } else {
	        // Xóa hobbies khỏi tài khoản
	        isUpdated = account.getHobbys().removeAll(hobbies);
	    }

	    // Lưu tài khoản nếu có thay đổi
	    if (isUpdated) {
	        accountRepository.save(account);
	    }

	    return isUpdated;
	}

	@Override
	public void addHobbyToAccount(Long accountId, List<Long> hobbyId) {
		// Tìm tài khoản bằng accountId
		Optional<Account> accountOptional = accountRepository.findById(accountId);
		if (accountOptional.isEmpty()) {
			throw new ResourceNotFoundException("Account not found with id: " + accountId);
		}

		// Tìm danh sách hobbies từ hobbyIds
		List<Hobby> hobbies = hobbyRepository.findAllById(hobbyId);
		if (hobbies.size() != hobbyId.size()) {
			throw new ResourceNotFoundException("One or more hobbies not found");
		}

		Account account = accountOptional.get();

		// Duyệt qua từng hobby và thêm vào tài khoản nếu chưa có
		for (Hobby hobby : hobbies) {
			if (!account.getHobbys().contains(hobby)) {
				account.getHobbys().add(hobby); // Thêm hobby vào tài khoản nếu chưa có
			}
		}

		accountRepository.save(account); // Lưu lại tài khoản đã cập nhật
	}

	@Override
	public void removeHobbyFromAccount(Long accountId, List<Long> hobbyId) {
		// Tìm tài khoản bằng accountId
		Optional<Account> accountOptional = accountRepository.findById(accountId);
		if (accountOptional.isEmpty()) {
			throw new ResourceNotFoundException("Account not found with id: " + accountId);
		}

		// Tìm danh sách hobbies từ hobbyIds
		List<Hobby> hobbies = hobbyRepository.findAllById(hobbyId);
		if (hobbies.size() != hobbyId.size()) {
			throw new ResourceNotFoundException("One or more hobbies not found");
		}

		Account account = accountOptional.get();

		// Duyệt qua từng hobby và xóa khỏi tài khoản nếu có
		for (Hobby hobby : hobbies) {
			if (account.getHobbys().contains(hobby)) {
				account.getHobbys().remove(hobby); // Xóa hobby khỏi account
			}
		}

		accountRepository.save(account);// TODO Auto-generated method stub

	}
	
	private boolean isHobbyExistInAccount(Account account, Hobby hobby) {
		// Kiểm tra xem hobby có tồn tại trong danh sách hobbies của tài khoản không
		return account.getHobbys().contains(hobby);
	}

}
