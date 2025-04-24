package vngo.rest.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.RestController;

import vngo.dto.AccountDto;
import vngo.exception.ResourceNotFoundException;
import vngo.service.FollowService;
import org.springframework.web.bind.annotation.PostMapping;

import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;



@CrossOrigin({"http://localhost:3000", "http://192.168.7.181:3000"})
@RestController
public class FollowController {
	
	@Autowired
	FollowService followService;
	
	@PostMapping("/follow")
	public ResponseEntity<String> followAcount(@RequestParam Long followerId, @RequestParam Long followedId) {
		try {
			followService.followAccount(followerId, followedId);
			return new ResponseEntity<>("Follow thành công",HttpStatus.OK);
		} catch (RuntimeException e) {
			return new ResponseEntity<>(e.getMessage(),HttpStatus.BAD_REQUEST);
		}		
	}
	
	@DeleteMapping("/unfollow")
	public ResponseEntity<String> unfollowAccount(@RequestParam Long followerId, @RequestParam Long followedId) {
		try {
			followService.unfollowAccount(followerId, followedId);
			return new ResponseEntity<>("Hủy theo dõi thành công", HttpStatus.OK);
		} catch (RuntimeException e) {
			return new ResponseEntity<>(e.getMessage(),HttpStatus.BAD_REQUEST);
		}
	}
	
	@GetMapping("/notfollowed/{followerId}")
	public ResponseEntity<List<AccountDto>> listNotFollow(@PathVariable Long followerId) {
		try {
			List<AccountDto> listAccountNotFollow = followService.findAccountsNotFollowedBy(followerId);
			return ResponseEntity.ok(listAccountNotFollow);
		} catch (ResourceNotFoundException e) {
			return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
		}
	}
	
	@GetMapping("/followed/{followerId}")
	public ResponseEntity<List<AccountDto>> listfollow(@PathVariable Long followerId) {
		try {
			List<AccountDto> listAccountFollow = followService.findAccountsFollowedBy(followerId);
			return ResponseEntity.ok(listAccountFollow);
		} catch (ResourceNotFoundException e) {
			return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
		}
	}
	
	@GetMapping("/followedlist/{followerId}")
	public ResponseEntity<List<AccountDto>> getListFollowedById(@PathVariable Long followerId) {
	    try {
	        List<AccountDto> followedAccounts = followService.getListFollowedById(followerId);
	        return ResponseEntity.ok(followedAccounts);
	    } catch (ResourceNotFoundException e) {
	        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
	    }
	}
	
	 @GetMapping("/checkfollow")
	    public ResponseEntity<Boolean> checkIfAlreadyFollowed(
	    		@RequestParam("followerId") Long followerId,
	            @RequestParam("followedId") Long followedId) {
	        boolean isFollowed = followService.checkIfAlreadyFollowed(followerId, followedId);
	        return ResponseEntity.ok(isFollowed);
	    }
}