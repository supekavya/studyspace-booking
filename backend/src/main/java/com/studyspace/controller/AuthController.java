package com.studyspace.controller;

import com.studyspace.model.User;
import com.studyspace.repository.UserRepository;
import com.studyspace.security.JwtUtils;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import jakarta.validation.constraints.*;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.http.*;
import org.springframework.security.authentication.*;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@Tag(name = "Authentication", description = "Register and login")
public class AuthController {

    private final AuthenticationManager authenticationManager;
    private final UserRepository userRepository;
    private final PasswordEncoder encoder;
    private final JwtUtils jwtUtils;

    @PostMapping("/register")
    @Operation(summary = "Register a new student account")
    public ResponseEntity<?> register(@Valid @RequestBody RegisterRequest req) {
        if (userRepository.existsByUsername(req.username))
            return ResponseEntity.badRequest().body(new MessageResponse("Username already taken."));
        if (userRepository.existsByEmail(req.email))
            return ResponseEntity.badRequest().body(new MessageResponse("Email already registered."));

        User user = User.builder()
                .username(req.username)
                .email(req.email)
                .password(encoder.encode(req.password))
                .fullName(req.fullName)
                .role(User.Role.STUDENT)
                .build();
        userRepository.save(user);
        return ResponseEntity.ok(new MessageResponse("Registered successfully!"));
    }

    @PostMapping("/login")
    @Operation(summary = "Login and receive JWT token")
    public ResponseEntity<?> login(@Valid @RequestBody LoginRequest req) {
        Authentication auth = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(req.username, req.password));
        String token = jwtUtils.generateToken(auth);
        User user = userRepository.findByUsername(req.username).orElseThrow();
        return ResponseEntity.ok(new AuthResponse(token, user));
    }

    // ── Inner DTOs ────────────────────────────────────────────────────────────

    @Data static class RegisterRequest {
        @NotBlank @Size(min=3,max=50) String username;
        @NotBlank @Email               String email;
        @NotBlank @Size(min=6)         String password;
        @NotBlank                      String fullName;
    }

    @Data static class LoginRequest {
        @NotBlank String username;
        @NotBlank String password;
    }

    @Data static class AuthResponse {
        String token; String type = "Bearer";
        Long id; String username; String email; String fullName; String role;
        AuthResponse(String token, User user) {
            this.token = token; this.id = user.getId(); this.username = user.getUsername();
            this.email = user.getEmail(); this.fullName = user.getFullName();
            this.role = user.getRole().name();
        }
    }

    @Data static class MessageResponse {
        String message;
        MessageResponse(String message) { this.message = message; }
    }
}
