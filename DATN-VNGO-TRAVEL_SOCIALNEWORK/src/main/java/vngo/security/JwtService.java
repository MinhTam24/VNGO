package vngo.security;

import java.security.Key;
import java.util.Date;

import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;

@Service
public class JwtService {

	public String createToken(String email, long userId) {
		long now = System.currentTimeMillis();
		String token = Jwts.builder()
				.setSubject(email)
				.claim("userId", userId)
				.setIssuedAt(new Date(now))
				.setExpiration(new Date(now + 1000 * 60 * 30)) // milis
				.signWith(this.getSingKey(), SignatureAlgorithm.HS256).compact();
		System.out.println(token);
		return token;
	}

	private Key getSingKey() {
		String SECRET = "5367566B59703373367639792F423F4528482B4D6251655468576D5A71347437";
		byte[] keyBytes = Decoders.BASE64.decode(SECRET);
		return Keys.hmacShaKeyFor(keyBytes);
	}

	public String getUsername(String token) {
		Claims claims = this.getClaims(token);
		return claims.getSubject();
	}

	private Claims getClaims(String token) {
		return Jwts.parserBuilder().setSigningKey(this.getSingKey()).build().parseClaimsJws(token).getBody();
	}

	public boolean validateToken(String token, UserDetails userDetails) {
		Claims claims = this.getClaims(token);
		String username = claims.getSubject();
		Date expiration = claims.getExpiration();
		return (username.equals(userDetails.getUsername()) && !expiration.before(new Date()));
	}

}
