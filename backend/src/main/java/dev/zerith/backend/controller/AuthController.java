package dev.zerith.backend.controller;

import dev.zerith.backend.dto.ApiResponse;
import dev.zerith.backend.dto.AuthDTO;
import dev.zerith.backend.entity.Usuario;
import dev.zerith.backend.service.AuthService;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
@Slf4j
public class AuthController {

    private final AuthService authService;

    @PostMapping("/register")
    public ResponseEntity<ApiResponse<AuthDTO.AuthResponse>> register(
            @Valid @RequestBody AuthDTO.RegisterRequest req) {
        AuthDTO.AuthResponse response = authService.register(req);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.ok("Usuário criado com sucesso", response));
    }

    @PostMapping("/login")
    public ResponseEntity<ApiResponse<AuthDTO.AuthResponse>> login(
            @Valid @RequestBody AuthDTO.LoginRequest req,
            HttpServletResponse response) {
        AuthDTO.AuthResponse authResponse = authService.login(req, response);
        return ResponseEntity.ok(ApiResponse.ok("Login realizado com sucesso", authResponse));
    }

    @PostMapping("/logout")
    public ResponseEntity<ApiResponse<Void>> logout(HttpServletResponse response) {
        authService.logout(response);
        return ResponseEntity.ok(ApiResponse.ok("Logout realizado com sucesso", null));
    }

    @GetMapping("/me")
    public ResponseEntity<ApiResponse<AuthDTO.AuthResponse>> me(Authentication authentication) {
        Usuario usuario = (Usuario) authentication.getPrincipal();
        AuthDTO.AuthResponse response = AuthDTO.AuthResponse.builder()
                .nome(usuario.getNome())
                .email(usuario.getEmail())
                .role(usuario.getRole())
                .build();
        return ResponseEntity.ok(ApiResponse.ok(response));
    }
}
