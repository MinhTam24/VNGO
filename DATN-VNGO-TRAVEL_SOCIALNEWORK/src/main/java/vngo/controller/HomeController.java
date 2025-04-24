package vngo.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
public class HomeController {

	@Autowired
	PasswordEncoder passwordEncoder;

	@RequestMapping("/user/home")
	public String homePage() {
		return "/html/home";
	}

	@GetMapping("/admin/home")
	public String adminPage() {
		return "/html/admin";
	}

	@RequestMapping("/login")
	public String lgoinPage() {
		return "/html/login";
	}

}
