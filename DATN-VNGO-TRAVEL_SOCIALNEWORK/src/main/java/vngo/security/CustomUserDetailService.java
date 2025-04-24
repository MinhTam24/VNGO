package vngo.security;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import vngo.entity.Account;
import vngo.repository.AccountRepository;
import vngo.repository.RoleRepository;

@Service
public class CustomUserDetailService implements UserDetailsService {
	@Autowired
	AccountRepository accountRepository;
	
	@Autowired
	RoleRepository roleRepository;

	@Override
	public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
		 Optional<Account> account = accountRepository.findByEmail(email);
		 if(account.isPresent()) {
			 Account acc = account.get();
			 List<String> roleNames = roleRepository.findRoleNameByAccountEmail(email);
			 List<GrantedAuthority> grantedAuthorities = new ArrayList<GrantedAuthority>();
			 roleNames.stream().forEach(name -> grantedAuthorities.add(new SimpleGrantedAuthority(name)));
			 System.out.println("Account ID: " + acc.getId());
			 CustomUserDetails userDetails = new CustomUserDetails(email, acc.getPassWord() , grantedAuthorities, acc.getId());
			 return userDetails;
		 }
		 else {
			 throw new UsernameNotFoundException("Not found Account!");
		 }
	}

}
