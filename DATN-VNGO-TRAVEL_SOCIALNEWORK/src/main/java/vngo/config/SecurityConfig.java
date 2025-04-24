package vngo.config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfigurationSource;

import vngo.filter.AuthFilter;
import vngo.security.CustomUserDetailService;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

	@Autowired
	CustomUserDetailService customUserDetailService;
	
	@Autowired
	CorsConfigurationSource configurationSource;
	
	@Bean
	public PasswordEncoder passwordEncoder() {
		return new BCryptPasswordEncoder();
	}

	@Bean
	public AuthenticationManager authenticationManager(HttpSecurity http, PasswordEncoder passwordEncoder)
			throws Exception {
		AuthenticationManagerBuilder auth = http.getSharedObject(AuthenticationManagerBuilder.class);
		auth.userDetailsService(customUserDetailService).passwordEncoder(passwordEncoder());
		return auth.build();
	}

	@Bean
	public SecurityFilterChain securityFilterChain(HttpSecurity http, AuthFilter authFilter) throws Exception {
		http.csrf(csrf -> csrf.disable());
        http.cors(cors -> cors.configurationSource(configurationSource));
		
		http.authorizeHttpRequests(auth -> {
		    auth.requestMatchers("/api/login").permitAll(); // Cho phép truy cập đến /api/login

//			auth.requestMatchers("/admin/home").hasRole("ADMIN");
//			auth.requestMatchers("/api/account/**").hasAnyRole("ADMIN", "USER");
//			auth.requestMatchers("/api/auth/**").authenticated();
//			auth.requestMatchers("/ws/**").permitAll();
//			auth.requestMatchers( "/html/**", "/js/**", "/img/**", "/css").permitAll();
//			auth.requestMatchers("/user/home", "/login", "/api/login").permitAll();
			auth.anyRequest().permitAll();
		});
//
//		http.exceptionHandling(denied -> {
//			denied.accessDeniedPage("/access-denied.html");
//		});

		http.sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
				.addFilterBefore(authFilter, UsernamePasswordAuthenticationFilter.class);

		return http.build();
	}

}
