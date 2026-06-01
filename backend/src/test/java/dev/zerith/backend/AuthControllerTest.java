package dev.zerith.backend;

import dev.zerith.backend.config.AppConfig;
import dev.zerith.backend.config.GlobalExceptionHandler;
import dev.zerith.backend.config.SecurityConfig;
import dev.zerith.backend.controller.AuthController;
import dev.zerith.backend.dto.AuthDTO;
import dev.zerith.backend.entity.Usuario;
import dev.zerith.backend.filter.JwtAuthFilter;
import dev.zerith.backend.service.AuthService;
import dev.zerith.backend.service.JwtService;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletResponse;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Import;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.test.web.servlet.MockMvc;

import java.util.UUID;

import static org.hamcrest.Matchers.containsString;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.doAnswer;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(AuthController.class)
@Import({SecurityConfig.class, JwtAuthFilter.class, GlobalExceptionHandler.class, AppConfig.class})
class AuthControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private AuthService authService;

    @MockBean
    private JwtService jwtService;

    @Test
    @DisplayName("POST /api/v1/auth/register — deve registrar novo usuário")
    void deveRegistrarNovoUsuario() throws Exception {
        AuthDTO.AuthResponse resp = AuthDTO.AuthResponse.builder()
                .token("eyJhbGciOiJIUzI1NiJ9.test")
                .nome("João Silva")
                .email("joao@zerith.dev")
                .role(Usuario.Role.TECHNICIAN)
                .build();

        when(authService.register(any())).thenReturn(resp);

        mockMvc.perform(post("/api/v1/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {"nome":"João Silva","email":"joao@zerith.dev","senha":"senha123"}
                                """))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.email").value("joao@zerith.dev"))
                .andExpect(jsonPath("$.data.nome").value("João Silva"))
                .andExpect(jsonPath("$.data.role").value("TECHNICIAN"))
                // Garante que senha NUNCA volta na resposta
                .andExpect(jsonPath("$.data.senha").doesNotExist())
                .andExpect(jsonPath("$.data.senhaHash").doesNotExist());
    }

    @Test
    @DisplayName("POST /api/v1/auth/login — deve fazer login e receber cookie zerith_token")
    void deveFazerLoginEReceberCookieZerithToken() throws Exception {
        doAnswer(invocation -> {
            HttpServletResponse response = invocation.getArgument(1);
            response.addHeader(HttpHeaders.SET_COOKIE,
                    "zerith_token=jwt.token.fake; Path=/; Max-Age=86400; HttpOnly; SameSite=Strict");
            return AuthDTO.AuthResponse.builder()
                    .token("jwt.token.fake")
                    .nome("Admin")
                    .email("admin@zerith.dev")
                    .role(Usuario.Role.ADMIN)
                    .build();
        }).when(authService).login(any(AuthDTO.LoginRequest.class), any(HttpServletResponse.class));

        mockMvc.perform(post("/api/v1/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {"email":"admin@zerith.dev","senha":"admin123"}
                                """))
                .andExpect(status().isOk())
                .andExpect(header().string(HttpHeaders.SET_COOKIE, containsString("zerith_token")))
                .andExpect(header().string(HttpHeaders.SET_COOKIE, containsString("HttpOnly")))
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.email").value("admin@zerith.dev"))
                .andExpect(jsonPath("$.data.role").value("ADMIN"));
    }

    @Test
    @DisplayName("POST /api/v1/auth/login — deve rejeitar login com senha errada")
    void deveRejeitarLoginComSenhaErrada() throws Exception {
        when(authService.login(any(), any()))
                .thenThrow(new BadCredentialsException("Email ou senha incorretos"));

        mockMvc.perform(post("/api/v1/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {"email":"admin@zerith.dev","senha":"senhaErrada"}
                                """))
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.success").value(false))
                .andExpect(jsonPath("$.message").value("Email ou senha incorretos"));
    }

    @Test
    @DisplayName("GET /api/v1/auth/me — deve acessar /me com token válido")
    void deveAcessarMeComTokenValido() throws Exception {
        Usuario mockUsuario = Usuario.builder()
                .id(UUID.randomUUID())
                .nome("Técnico Zerith")
                .email("tec@zerith.dev")
                .senhaHash("$2a$10$hash")
                .role(Usuario.Role.TECHNICIAN)
                .ativo(true)
                .build();

        when(jwtService.extrairEmail("valid.token")).thenReturn("tec@zerith.dev");
        when(authService.loadUserByUsername("tec@zerith.dev")).thenReturn(mockUsuario);
        when(jwtService.tokenValido(eq("valid.token"), any())).thenReturn(true);

        mockMvc.perform(get("/api/v1/auth/me")
                        .cookie(new Cookie("zerith_token", "valid.token")))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.email").value("tec@zerith.dev"))
                .andExpect(jsonPath("$.data.nome").value("Técnico Zerith"))
                .andExpect(jsonPath("$.data.role").value("TECHNICIAN"))
                .andExpect(jsonPath("$.data.senhaHash").doesNotExist());
    }

    @Test
    @DisplayName("GET /api/v1/auth/me — deve bloquear endpoint protegido sem token")
    void deveBloquearlEndpointProtegidoSemToken() throws Exception {
        // Nenhum cookie enviado — SecurityContext não autenticado
        when(jwtService.extrairEmail(anyString())).thenReturn(null);

        mockMvc.perform(get("/api/v1/auth/me"))
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.success").value(false));
    }
}
