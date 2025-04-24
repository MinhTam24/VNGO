package vngo.impl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import vngo.entity.Account;
import vngo.exception.InvalidCredentialsException;
import vngo.repository.AccountRepository;

import java.util.HashMap;
import java.util.Map;
import java.util.Random;
import java.util.concurrent.TimeUnit;

@Service
public class EmailService {

	@Autowired
	AccountRepository accountRepository;

	@Autowired
	private JavaMailSender emailSender;

	// Lưu OTP và thời gian hết hạn
	private Map<String, OtpData> otpStore = new HashMap<>();
	private static final int OTP_EXPIRATION_TIME = 5; // Thời gian hết hạn OTP (5 phút)

	// Lớp lưu trữ OTP và timestamp
	private static class OtpData {
		String otp;
		long timestamp;

		OtpData(String otp) {
			this.otp = otp;
			this.timestamp = System.currentTimeMillis();
		}
	}

	// Gửi email với OTP
	public String sendVerificationEmail(String toEmail) {
        System.out.println("Received email: " + toEmail);  // In ra email nhận được từ yêu cầu

        if (toEmail == null || toEmail.isEmpty()) {
            throw new IllegalArgumentException("Recipient email cannot be null or empty");
        }

        if (!isValidEmail(toEmail)) {
            throw new IllegalArgumentException("Invalid email address");
        }
        
        Account account = accountRepository.findByEmail(toEmail)
        		.orElseThrow(() -> new InvalidCredentialsException("Không tìm thấy email" + toEmail));

        String otp = generateOtp();

        try {
     
            MimeMessage message = emailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true);
            helper.setTo(toEmail);
            helper.setSubject("Mã Xác Nhận VNGO");
            helper.setText("<html>"
                    + "<body>"
                    + "<h3>Mã Xác Nhận của bạn là:</h3></br>"
                    + "<div style='width: 200px; height: 100px; background-color: #f0f0f0; border: 2px solid #000; display: flex; justify-content: center; align-items: center;'>"
                    + "<h1 style='font-size: 36px; color: #333; margin: 0;'>" + otp + "</h1>"
                    + "</div>"
                    + "</body>"
                    + "</html>", true);
            emailSender.send(message);
            System.out.println("Sent OTP to: " + toEmail + " with OTP: " + otp);

            // Lưu OTP vào bộ nhớ
            otpStore.put(toEmail, new OtpData(otp));
            return otp;
        } catch (MessagingException e) {
            System.out.println("Failed to send OTP: " + e.getMessage());
            throw new RuntimeException("Failed to send OTP email", e);
        }
    }

	// Tạo OTP ngẫu nhiên
	private String generateOtp() {
		Random random = new Random();
		return String.format("%06d", random.nextInt(999999));
	}

	// Kiểm tra định dạng email hợp lệ
	private boolean isValidEmail(String email) {
		String emailRegex = "^[A-Za-z0-9+_.-]+@(.+)$";
		return email != null && email.matches(emailRegex);
	}

	// Xác minh OTP có hợp lệ hay không
	public boolean verifyOtp(String email, String otp) {
		OtpData otpData = otpStore.get(email);
		if (otpData != null
				&& System.currentTimeMillis() - otpData.timestamp <= TimeUnit.MINUTES.toMillis(OTP_EXPIRATION_TIME)) {
			return otpData.otp.equals(otp);
		}
		return false;
	}
}
