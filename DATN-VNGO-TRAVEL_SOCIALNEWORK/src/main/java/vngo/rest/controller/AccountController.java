package vngo.rest.controller;

import java.io.IOException;
import java.util.List;
import java.util.Map;

import org.apache.coyote.BadRequestException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.repository.query.Param;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import vngo.dto.AccountDto;
import vngo.dto.LoginDto;
import vngo.dto.ProfileDto;
import vngo.dto.RegisterDto;
import vngo.dto.ResetPasswordRequest;
import vngo.entity.Account;
import vngo.exception.InvalidCredentialsException;
import vngo.exception.ResourceNotFoundException;
import vngo.impl.AccountServiceImpl;
import vngo.security.JwtService;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;

@CrossOrigin({ "http://localhost:3000", "http://192.168.7.181:3000" })
@RestController
public class AccountController {

	@Autowired
	AccountServiceImpl accountService;

	@Autowired
	AuthenticationManager authenticationManager;

	@Autowired
	JwtService jwtService;

	@PostMapping("/api/login")
	public ResponseEntity<?> login(@RequestBody LoginDto loginDto) {
		try {
			String token = accountService.login(loginDto);
			return ResponseEntity.ok(Map.of("token", token));
		} catch (InvalidCredentialsException e) {
			return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("message", e.getMessage()));
		} catch (ResourceNotFoundException e) {
			return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("message", e.getMessage()));
		} catch (Exception e) {
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
					.body(Map.of("message", "An error occurred during login" + e));
		}
	}
	
	

	@PostMapping("/api/account")
	public ResponseEntity<?> signUp(@RequestBody RegisterDto registerDto) {
		try {
			accountService.SignUp(registerDto);
			return ResponseEntity.ok().build();
		} catch (Exception e) {
			e.printStackTrace();
			return ResponseEntity.status(HttpStatus.BAD_REQUEST)
					.body("An unexpected error occurred: " + e.getMessage());
		}
	}

	@PutMapping("/api/reset-password")
	public ResponseEntity<Boolean> resetPassWord(@RequestBody ResetPasswordRequest request) {
		try {
			return ResponseEntity.ok(accountService.resetPassword(request));
		} catch (Exception e) {
			return ResponseEntity.badRequest().build();
		}
	}

	@GetMapping("/api/account/{id}")
	public ResponseEntity<AccountDto> getUserById(@PathVariable long id) {
		try {
			AccountDto account = accountService.getById(id);
			return ResponseEntity.ok(account);
		} catch (ResourceNotFoundException ex) {
			return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
		}
	}

	@GetMapping("/api/account/email/{email}")
	public ResponseEntity<AccountDto> getAccountByEmail(@PathVariable String email) {
		try {
			AccountDto accountDto = accountService.getAccountByEmail(email);
			return ResponseEntity.ok(accountDto);
		} catch (ResourceNotFoundException e) {
			return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
		}
	}

	@GetMapping("/api/account")
	public ResponseEntity<List<AccountDto>> getListAccount() {
		try {
			List<AccountDto> listAccountDto = accountService.getAll();
			return ResponseEntity.ok(listAccountDto);
		} catch (ResourceNotFoundException e) {
			return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
		}
	}

	@PostMapping("/api/post-avatar")
	public ResponseEntity<String> postImage(@RequestParam("images") List<MultipartFile> files) {
		try {
			return ResponseEntity.ok(accountService.setAvartar(files));
		} catch (IOException e) {
			e.printStackTrace();
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
					.body("Failed to upload avatar due to an error.");
		} catch (Exception e) {
			e.printStackTrace();
			return ResponseEntity.status(HttpStatus.BAD_REQUEST)
					.body("An unexpected error occurred: " + e.getMessage());
		}
	}

	@GetMapping("/api/account/contact")
	public ResponseEntity<List<AccountDto>> getListContact(@RequestParam("accountId") Long id) {
		System.out.println("nhận id" + id);
		try {
			List<AccountDto> listAccountDto = accountService.getContactWith(id);
			return ResponseEntity.ok(listAccountDto);
		} catch (ResourceNotFoundException e) {
			return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
		}
	}

	@GetMapping("/api/account/search")
	public ResponseEntity<List<AccountDto>> SearchAccount(@RequestParam("keyWord") String keyWord) {
		System.out.println("Key word:" + keyWord);
		try {
			List<AccountDto> listAccountDto = accountService.searchAccount(keyWord);
			return ResponseEntity.ok(listAccountDto);
		} catch (ResourceNotFoundException e) {
			return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
		}
	}
	
	@GetMapping("/profile/{id}")
	public ResponseEntity<ProfileDto> getProfile(@PathVariable Long id) {
	    try {
	        ProfileDto profileDto = accountService.profile(id);
	        System.out.println("Profile data: " + profileDto);
	        if (profileDto != null) {
	            return ResponseEntity.ok(profileDto);
	        } else {
	            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
	        }
	    } catch (Exception e) {
	        e.printStackTrace(); // In lỗi để kiểm tra trong log
	        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
	    }
	}
	
	
	@PutMapping("/addhobbies/{accountId}")
    public ResponseEntity<String> addHobbiesToAccount(
            @PathVariable Long accountId,
            @RequestBody List<Long> hobbyIds) {

        try {
            // Kiểm tra đầu vào
            if (hobbyIds == null || hobbyIds.isEmpty()) {
                return ResponseEntity.badRequest().body("Hobby list cannot be null or empty");
            }

            // Thêm hobbies
            accountService.addHobbyToAccount(accountId, hobbyIds);

            // Trả về phản hồi thành công
            return ResponseEntity.ok("Hobbies added successfully");
        } catch (ResourceNotFoundException e) {
            return ResponseEntity.status(404).body(e.getMessage());
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body("Invalid Input: " + e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Internal Server Error: " + e.getMessage());
        }
    }
	
	
	 @PutMapping("/removehobbies/{accountId}")
	    public ResponseEntity<String> removeHobbiesFromAccount(
	            @PathVariable Long accountId,
	            @RequestBody List<Long> hobbyIds) {

	        try {
	            // Kiểm tra đầu vào
	            if (hobbyIds == null || hobbyIds.isEmpty()) {
	                return ResponseEntity.badRequest().body("Hobby list cannot be null or empty");
	            }

	            // Xóa hobbies
	            accountService.removeHobbyFromAccount(accountId, hobbyIds);

	            // Trả về phản hồi thành công
	            return ResponseEntity.ok("Hobbies removed successfully");
	        } catch (ResourceNotFoundException e) {
	            return ResponseEntity.status(404).body(e.getMessage());
	        } catch (IllegalArgumentException e) {
	            return ResponseEntity.badRequest().body("Invalid Input: " + e.getMessage());
	        } catch (Exception e) {
	            return ResponseEntity.status(500).body("Internal Server Error: " + e.getMessage());
	        }
	    }

	@PutMapping("/updatehobbies/{accountId}")
	public ResponseEntity<String> updateHobbyForAccount(
	        @PathVariable Long accountId, 
	        @RequestBody List<Long> hobbyId,
	        @RequestParam boolean isAdd) {

	    try {
	        // Kiểm tra đầu vào
	    	if (hobbyId == null || hobbyId.isEmpty()) {
	            return ResponseEntity.badRequest().body("Hobby list cannot be null or empty");
	        }

	        // Cập nhật hobbies
	        boolean isSuccess = accountService.updateHobbyForAccount(accountId, hobbyId, isAdd);

	        // Trả về phản hồi
	        return isSuccess 
	            ? ResponseEntity.ok(isAdd ? "Hobbies added successfully" : "Hobbies removed successfully") 
	            : ResponseEntity.status(400).body("No changes were made.");
	    } catch (ResourceNotFoundException e) {
	        return ResponseEntity.status(404).body(e.getMessage());
	    } catch (IllegalArgumentException e) {
	        return ResponseEntity.badRequest().body("Invalid Input: " + e.getMessage());
	    } catch (Exception e) { 
	        return ResponseEntity.status(500).body("Internal Server Error: " + e.getMessage());
	    }
	}

	
	@PutMapping("/update/{id}")
    public ResponseEntity<AccountDto> updateAccount(@PathVariable Long id, @RequestBody AccountDto accountDto) {
        try {
            accountDto.setId(id);
            AccountDto updatedAccount = accountService.update(accountDto);
            return ResponseEntity.ok(updatedAccount);
        } catch (ResourceNotFoundException ex) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        } catch (Exception ex) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

}
