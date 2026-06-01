package dev.zerith.backend.service;

import dev.zerith.backend.dto.AuthDTO;
import dev.zerith.backend.entity.Usuario;
import dev.zerith.backend.repository.UsuarioRepository;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseCookie;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Duration;

@Service
@RequiredArgsConstructor
@Slf4j
public class AuthService implements UserDetailsService {

    private final UsuarioRepository repository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    // ----------------------------------------------------------------
    // UserDetailsService — usado pelo Spring Security internamente
    // ----------------------------------------------------------------

    @Override
    @Transactional(readOnly = true)
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        return repository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("Usuário não encontrado: " + email));
    }

    // ----------------------------------------------------------------
    // Operações de autenticação
    // ----------------------------------------------------------------

    @Transactional
    public AuthDTO.AuthResponse register(AuthDTO.RegisterRequest req) {
        if (repository.existsByEmail(req.getEmail())) {
            throw new IllegalArgumentException("Email já cadastrado: " + req.getEmail());
        }

        Usuario usuario = Usuario.builder()
                .nome(req.getNome())
                .email(req.getEmail())
                .senhaHash(passwordEncoder.encode(req.getSenha()))
                .role(Usuario.Role.TECHNICIAN)
                .build();

        usuario = repository.save(usuario);
        log.info("Usuário registrado: {} ({})", usuario.getEmail(), usuario.getRole());

        return AuthDTO.AuthResponse.builder()
                .token(jwtService.gerarToken(usuario))
                .nome(usuario.getNome())
                .email(usuario.getEmail())
                .role(usuario.getRole())
                .build();
    }

    @Transactional(readOnly = true)
    public AuthDTO.AuthResponse login(AuthDTO.LoginRequest req, HttpServletResponse response) {
        Usuario usuario = repository.findByEmail(req.getEmail())
                .filter(Usuario::isEnabled)
                .orElseThrow(() -> new BadCredentialsException("Email ou senha incorretos"));

        if (!passwordEncoder.matches(req.getSenha(), usuario.getSenhaHash())) {
            throw new BadCredentialsException("Email ou senha incorretos");
        }

        String token = jwtService.gerarToken(usuario);
        setTokenCookie(response, token);

        log.info("Login realizado: {}", usuario.getEmail());
        return AuthDTO.AuthResponse.builder()
                .token(token)
                .nome(usuario.getNome())
                .email(usuario.getEmail())
                .role(usuario.getRole())
                .build();
    }

    public void logout(HttpServletResponse response) {
        // Limpa o cookie zerando o valor e o max-age
        ResponseCookie cookie = ResponseCookie.from("zerith_token", "")
                .httpOnly(true)
                .secure(false)
                .path("/")
                .maxAge(0)
                .sameSite("Strict")
                .build();
        response.addHeader(HttpHeaders.SET_COOKIE, cookie.toString());
    }

    // ----------------------------------------------------------------
    // Helpers
    // ----------------------------------------------------------------

    private void setTokenCookie(HttpServletResponse response, String token) {
        ResponseCookie cookie = ResponseCookie.from("zerith_token", token)
                .httpOnly(true)
                .secure(false)      // definir true em prod (HTTPS obrigatório)
                .path("/")
                .maxAge(Duration.ofHours(24))
                .sameSite("Strict")
                .build();
        response.addHeader(HttpHeaders.SET_COOKIE, cookie.toString());
    }
}
