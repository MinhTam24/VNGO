package vngo.security;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.stereotype.Service;

import vngo.dto.AccountDto;
import vngo.entity.Account;
import vngo.exception.ResourceNotFoundException;
import vngo.repository.AccountRepository;
import vngo.service.AccountService;
import vngo.service.ImageService;

import java.util.Collection;
import java.util.Optional;

@Service
public class Auth {
	
	@Autowired
	AccountRepository accountRepository;
	
	@Autowired
	ImageService imageService;
	

    public String getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        
        if (authentication != null && authentication.isAuthenticated()) {
            return authentication.getName(); // Trả về tên email
        }
        
        return null; 
    }

    // Trả về vai trò của người dùng hiện tại
    public Collection<? extends GrantedAuthority> getRoles() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        
        if (authentication != null && authentication.isAuthenticated()) {
            return authentication.getAuthorities(); 
        }
        
        return null; 
    }

    // Trả về chi tiết Authentication (ví dụ: thông tin người dùng, vai trò, ...)
    public Authentication getAuthentication() {
        return SecurityContextHolder.getContext().getAuthentication();
    }

    // Kiểm tra xem người dùng có phải là admin không
    public boolean isAdmin() {
        Collection<? extends GrantedAuthority> roles = getRoles();
        
        if (roles != null) {
            for (GrantedAuthority authority : roles) {
                if ("ROLE_ADMIN".equals(authority.getAuthority())) {
                    return true;
                }
            }
        }
        
        return false;
    }

    // Kiểm tra xem người dùng có phải là người dùng thông thường không
    public boolean isUser() {
        Collection<? extends GrantedAuthority> roles = getRoles();
        
        if (roles != null) {
            for (GrantedAuthority authority : roles) {
                if ("ROLE_USER".equals(authority.getAuthority())) {
                    return true;
                }
            }
        }
        
        return false;
    }

    // Trả về id người dùng nếu có 
    public Long getUserId() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication != null && authentication.isAuthenticated()) {
            Object principal = authentication.getPrincipal();
            if (principal instanceof CustomUserDetails) {
                return ((CustomUserDetails) principal).getUserId();
            } else {
                System.out.println("Principal is not CustomUserDetails: " + principal);
            }
        }
        return null;
    }
    
    
    public String getFullname() {
    	Optional<Account> account = accountRepository.findByEmail(getCurrentUser());
    	if(account.isPresent()) {
    		return account.get().getFullName();
    	}
    	throw new  ResourceNotFoundException("NOT ACCOUNT WITH EMAIL" + getCurrentUser());
    }
    
    
    public String getAvarta() {
    	Optional<Account> account = accountRepository.findByEmail(getCurrentUser());
    	if(account.isPresent()) {
    		return imageService.getAvartaByAccountId(account.get().getId());
    	}
    	throw new  ResourceNotFoundException("NOT ACCOUNT WITH EMAIL" + getCurrentUser());
    }
    
   
}
