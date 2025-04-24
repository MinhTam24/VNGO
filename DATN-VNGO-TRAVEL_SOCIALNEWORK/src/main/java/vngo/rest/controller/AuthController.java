package vngo.rest.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
import vngo.security.Auth;

@CrossOrigin({"http://localhost:3000" , "http://192.168.7.181:3000"})
@RestController
public class AuthController {

    @Autowired
    private Auth auth;

    @GetMapping("/api/auth/current-user")
    public ResponseEntity<String> getCurrentUser() {
        String currentUser = auth.getCurrentUser();
        if (currentUser != null) {
            return ResponseEntity.ok(currentUser);
        }
        return ResponseEntity.status(401).body("No user is logged in");
    }
    
    @GetMapping("/api/auth/full-name")
    public ResponseEntity<String> getFullName(){
    	String fullName = auth.getFullname();
    	if(fullName != null) {
    		return ResponseEntity.ok(fullName);
    	}
        return ResponseEntity.status(401).body("No user is logged in");
    }

    @GetMapping("/api/auth/roles")
    public ResponseEntity<?> getRoles() {
        return ResponseEntity.ok(auth.getRoles());
    }

    @GetMapping("/api/auth/is-admin")
    public ResponseEntity<Boolean> isAdmin() {
        return ResponseEntity.ok(auth.isAdmin());
    }

    @GetMapping("/api/auth/is-user")
    public ResponseEntity<Boolean> isUser() {
        return ResponseEntity.ok(auth.isUser());
    }

    @GetMapping("/api/auth/user-id")
    public ResponseEntity<Long> getUserId() {
        Long userId = auth.getUserId();
        if (userId != null) {
            return ResponseEntity.ok(userId);
        }
        return ResponseEntity.status(401).body(null);
    }
    
    @GetMapping("/api/auth/avatar")
    public ResponseEntity<String> getAvarta() {
        return ResponseEntity.ok(auth.getAvarta());
    }
    
    
}
