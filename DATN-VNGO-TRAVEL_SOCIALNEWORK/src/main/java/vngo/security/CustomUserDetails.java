package vngo.security;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;

public class CustomUserDetails implements UserDetails {
    private Long userId;
    private String username;
    private String password;
    private Collection<? extends GrantedAuthority> authorities;

    public CustomUserDetails(String username, String password, Collection<? extends GrantedAuthority> authorities, Long userId) {
        this.username = username;
        this.password = password;
        this.authorities = authorities;
        this.userId = userId;
    }

    public Long getUserId() {
        return userId;
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return authorities;
    }

    @Override
    public String getPassword() {
        return password;
    }

    @Override
    public String getUsername() {
        return username;
    }

    @Override
    public boolean isAccountNonExpired() {
        return true; // Có thể tùy chỉnh theo logic của bạn
    }

    @Override
    public boolean isAccountNonLocked() {
        return true; // Có thể tùy chỉnh theo logic của bạn
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true; // Có thể tùy chỉnh theo logic của bạn
    }

    @Override
    public boolean isEnabled() {
        return true; // Có thể tùy chỉnh theo logic của bạn
    }
}
