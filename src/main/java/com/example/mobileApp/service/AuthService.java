package com.example.mobileApp.service;

import java.time.LocalDateTime;
import java.util.Random;
import java.util.UUID;

import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.thymeleaf.TemplateEngine;
import org.thymeleaf.context.Context;

import com.example.mobileApp.dto.request.ForgotPasswordRequest;
import com.example.mobileApp.dto.request.LoginRequest;
import com.example.mobileApp.dto.request.RegisterRequest;
import com.example.mobileApp.dto.request.ResetPasswordRequest;
import com.example.mobileApp.dto.response.AuthResponse;
import com.example.mobileApp.entity.User;
import com.example.mobileApp.mapper.UserMapper;
import com.example.mobileApp.repository.UserRepository;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final UserMapper userMapper; 
    private final PasswordEncoder passwordEncoder;
    private final JavaMailSender mailSender;
    private final TemplateEngine templateEngine;


    //#region (register)
    public void register(RegisterRequest request) {
        // checking email 
        if (userRepository.findByEmail(request.getEmail()).isPresent()) {
            throw new RuntimeException("Email đã được sử dụng!");
        }
        
        // get data from mapper
        User user = userMapper.toUser(request);
        // encoding password
        user.setPassword(passwordEncoder.encode(request.getPassword()));

        // create verification token
        String token = UUID.randomUUID().toString();
        user.setVerificationToken(token);
        user.setTokenExpiry(LocalDateTime.now().plusHours(24)); 
        user.setVerified(false); 

        userRepository.save(user);

        // send verification email
        sendVerificationEmail(user.getEmail(), user.getFullName(), token);
    }
    //#endregion

    // #region(Login)
    public AuthResponse login(LoginRequest request) {
        
        
        // find email 
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("Email không tồn tại hoặc sai thông tin"));

        // check password
        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new RuntimeException("Mật khẩu không đúng");
        }

        // isActivated
        if (!user.isVerified()) {
            throw new RuntimeException("Tài khoản chưa kích hoạt. Vui lòng kiểm tra email của bạn.");
        }

        String token = "FAKE-JWT-" + user.getId();

        return new AuthResponse(200, token, "Đăng nhập thành công!");
    }
    //#endregion

    //#region (verify account)
    public String verifyAccount(String token) {
        User user = userRepository.findByVerificationToken(token)
                .orElseThrow(() -> new RuntimeException("Mã xác thực không hợp lệ"));

        // Kiểm tra hết hạn
        if (user.getTokenExpiry().isBefore(LocalDateTime.now())) {
            return "Link kích hoạt đã hết hạn. Vui lòng đăng ký lại.";
        }

        // Kích hoạt thành công
        user.setVerified(true);
        user.setVerificationToken(null); // Xóa token để không dùng lại được
        userRepository.save(user);
        
        return "Kích hoạt tài khoản thành công! Bạn có thể đăng nhập ngay bây giờ.";
    }
    //#endregion

    //#region sendEmail
    private void sendVerificationEmail(String toEmail, String name, String token) {
        String verificationLink = "http://localhost:8080/api/auth/verify?token=" + token;

        // 1. Tạo Context để truyền dữ liệu vào file HTML
        Context context = new Context();
        context.setVariable("link", verificationLink); 
        context.setVariable("name", name);          

        // 2. Convert HTML template thành chuỗi String
        String htmlContent = templateEngine.process("email-verification", context);

        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            helper.setTo(toEmail);
            helper.setSubject("🚀 Kích hoạt tài khoản ExploreEase ngay!");
            helper.setText(htmlContent, true); 

            mailSender.send(message);

        } catch (MessagingException e) {
            System.err.println("Lỗi gửi mail: " + e.getMessage());
        }
    }
    //#endregion

    //#region (Recover password)
    public void forgotPassword(ForgotPasswordRequest request) {
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("Email không tồn tại"));

        // 1. Tạo mã PIN 6 số (Thay vì UUID dài ngoằng)
        String pin = String.valueOf(new Random().nextInt(900000) + 100000);
        
        user.setVerificationToken(pin);
        user.setTokenExpiry(LocalDateTime.now().plusMinutes(15)); 
        userRepository.save(user);

        // 2. Gửi mail chứa mã PIN
        sendResetEmail(user.getEmail(), user.getFullName(), pin);
    }
    //#endregion

    //#region (send reset email)
    private void sendResetEmail(String toEmail, String name, String pin) {
        // Create Context
        Context context = new Context();
        context.setVariable("pin", pin); 
        context.setVariable("name", name);

        // Convert HTML template to String
        String htmlContent = templateEngine.process("password-reset", context);

        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            helper.setTo(toEmail);
            helper.setSubject("Mã xác thực của bạn là: " + pin); 
            helper.setText(htmlContent, true);

            mailSender.send(message);

        } catch (MessagingException e) {
            System.err.println("Lỗi gửi mail: " + e.getMessage());
        }
    }
    //#endregion

    //#region (Reset password)
    public void resetPassword(ResetPasswordRequest request) {
        User user = userRepository.findByVerificationToken(request.getEmail())
                .orElseThrow(() -> new RuntimeException("Email không tồn tại"));

        // Kiểm tra khớp PIN
        if (user.getVerificationToken() == null || !user.getVerificationToken().equals(request.getPin())) {
            throw new RuntimeException("Mã xác thực sai hoặc không hợp lệ");
        }

        // Kiểm tra hết hạn
        if (user.getTokenExpiry().isBefore(LocalDateTime.now())) {
            throw new RuntimeException("Mã PIN đã hết hạn. Vui lòng yêu cầu mã mới.");
        }

        // Cập nhật mật khẩu mới
        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        user.setVerificationToken(null); // Xóa mã PIN sau khi sử dụng
        userRepository.save(user);
    }
}   