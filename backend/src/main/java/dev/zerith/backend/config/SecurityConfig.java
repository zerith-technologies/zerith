package dev.zerith.backend.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    // Origens permitidas — injetadas por variável de ambiente (separadas por vírgula)
    // Exemplo dev: http://localhost:5173
    // Exemplo prod: https://italoantonio-dev.github.io
    @Value("${zerith.cors.allowed-origins:http://localhost:5173}")
    private List<String> allowedOrigins;

    /**
     * FASE 1 — Todos os endpoints abertos para desenvolvimento.
     * FASE 2 — Adicionar JWT filter e fechar os endpoints.
     */
    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            .csrf(AbstractHttpConfigurer::disable)
            .cors(cors -> cors.configurationSource(corsConfigurationSource()))
            .authorizeHttpRequests(auth -> auth
                .requestMatchers("/actuator/**").permitAll()
                .anyRequest().permitAll()   // TODO: trocar por .authenticated() na fase 2
            );

        return http.build();
    }

    /**
     * Configuração de CORS — permite requisições do frontend React (dev e prod).
     * Em produção, a variável ZERITH_CORS_ALLOWED_ORIGINS deve ser configurada no Render.
     */
    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration config = new CorsConfiguration();

        // Origens permitidas (frontend dev + GitHub Pages)
        config.setAllowedOrigins(allowedOrigins);

        // Métodos HTTP permitidos
        config.setAllowedMethods(List.of("GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"));

        // Headers permitidos
        config.setAllowedHeaders(List.of("*"));

        // Permite envio de cookies/Authorization header
        config.setAllowCredentials(true);

        // Cache do preflight: 1 hora
        config.setMaxAge(3600L);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);
        return source;
    }
}
