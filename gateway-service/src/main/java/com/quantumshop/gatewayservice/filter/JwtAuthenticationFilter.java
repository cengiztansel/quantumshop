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

        if (!jwtEnabled) {
            filterChain.doFilter(request, response);
            return;
        }

        String path = request.getRequestURI();
        String method = request.getMethod();
        boolean read = "GET".equalsIgnoreCase(method) || "HEAD".equalsIgnoreCase(method);
        boolean productPath = path.equals("/api/products") || path.startsWith("/api/products/");

        // 1. Her zaman açık: CORS ön kontrolü, giriş/kayıt, actuator
        if ("OPTIONS".equalsIgnoreCase(method) || path.startsWith("/api/auth") || path.startsWith("/actuator")) {
            filterChain.doFilter(request, response);
            return;
        }

        // 2. Herkese açık katalog: ürünleri okumak için token gerekmez
        if (productPath && read) {
            filterChain.doFilter(request, response);
            return;
        }

        // 3. Diğer her şey için token zorunlu
        String authHeader = request.getHeader("Authorization");
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            response.getWriter().write("JWT token missing");
            return;
        }

        String role;
        try {
            role = jwtService.extractRole(authHeader.substring(7));
        } catch (Exception e) {
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            response.getWriter().write("Invalid JWT");
            return;
        }

        // 4. RBAC: admin alanı ve ürün yazma işlemleri sadece ADMIN
        boolean adminOnly = path.startsWith("/api/admin") || (productPath && !read);
        if (adminOnly && !"ADMIN".equals(role)) {
            response.setStatus(HttpServletResponse.SC_FORBIDDEN);
            response.getWriter().write("ADMIN role required");
            return;
        }

        filterChain.doFilter(request, response);
    }
}
