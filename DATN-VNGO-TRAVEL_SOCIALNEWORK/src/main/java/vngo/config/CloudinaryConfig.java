package vngo.config;

import java.util.HashMap;
import java.util.Map;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import com.cloudinary.Cloudinary;

@Configuration
public class CloudinaryConfig {
	
	@Bean
	public Cloudinary getCloudinary() {
		Map<String, String> config = new HashMap();
		config.put("cloud_name", "dopwq7ciu");
		config.put("api_key", "337734919929346");
		config.put("api_secret", "91i5jmpJFYm4_UlvRn4Ka9ShZsc");
		config.put("folder", "VNGO");
		return new Cloudinary(config);
	}

}
