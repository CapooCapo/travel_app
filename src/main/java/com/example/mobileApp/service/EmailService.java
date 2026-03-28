package com.example.mobileApp.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;
import org.thymeleaf.TemplateEngine;
import org.thymeleaf.context.Context;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class EmailService {
    @Value("${app.base-url-ip}")
    private String baseIP;
    private final JavaMailSender mailSender;
    private final TemplateEngine templateEngine;

    // #region sendEmail
    public void sendVerificationEmail(String toEmail, String name, String token) {
        String verificationLink = baseIP + "/api/auth/verify?token=" + token;

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
            helper.setSubject("🚀 Verification now!");
            helper.setText(htmlContent, true);

            mailSender.send(message);

        } catch (MessagingException e) {
            throw new RuntimeException("Failed to send email");
            //System.err.println("sending email failed: " + e.getMessage());
        }
    }
    // #endregion

    // #region (send reset email)
    public void sendResetEmail(String toEmail, String name, String pin) {
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
            helper.setSubject("Your verification code is: " + pin);
            helper.setText(htmlContent, true);

            mailSender.send(message);

        } catch (MessagingException e) {
            System.err.println("Failed to send reset email: " + e.getMessage());
        }
    }
    // #endregion
}
