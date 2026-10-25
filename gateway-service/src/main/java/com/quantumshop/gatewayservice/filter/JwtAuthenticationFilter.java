package com.quantumshop.gatewayservice.filter;

import com.quantumshop.gatewayservice.service.JwtService;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;
import java.io.IOException;

@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtService jwtService;

    // jwt.enabled=false ise filtre hiçbir isteği engellemez (varsayılan: true)
    @Value("${jwt.enabled:true}")
    private boolean jwtEnabled;

    public JwtAuthenticationFilter(JwtService jwtService) {
        this.jwtService = jwtService;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {

        // 0. Auth kapalıysa her isteği doğrudan geçir
        if (!jwtEnabled) {
            filterChain.doFilter(request, response);
            return;
        }

        String path = request.getRequestURI();

        // 1. Muaf endpoint'ler (JWT kontrolü yapılmaz)
        if (path.startsWith("/api/auth") || path.startsWith("/actuator")) {
            filterChain.doFilter(request, response);
            return;
        }

        // 2. JWT header kontrolü
        String authHeader = request.getHeader("Authorization");
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            response.getWriter().write("JWT token missing");
            return;
        }

        try {
            String token = authHeader.substring(7);
            String role = jwtService.extractRole(token);

            // 3. RBAC
            if (path.startsWith("/api/admin") && !"ADMIN".equals(role)) {
                response.setStatus(HttpServletResponse.SC_FORBIDDEN);
                response.getWriter().write("ADMIN role required");
                return;
            }

            filterChain.doFilter(request, response);
        } catch (Exception e) {
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            response.getWriter().write("Invalid JWT");
        }
    }
}