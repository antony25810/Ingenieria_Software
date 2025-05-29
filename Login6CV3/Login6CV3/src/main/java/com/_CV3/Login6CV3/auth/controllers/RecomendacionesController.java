package com._CV3.Login6CV3.auth.controllers;

import com._CV3.Login6CV3.auth.dto.LibroDto;
import com._CV3.Login6CV3.auth.service.RecomendacionService;
import com._CV3.Login6CV3.auth.Entity.Usuario;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import com._CV3.Login6CV3.auth.service.CustomUserDetails;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import reactor.core.publisher.Mono;

import java.util.List;

@Controller
public class RecomendacionesController {

    @Autowired
    private RecomendacionService recomendacionService;

    @GetMapping("/libros/recomendaciones")
    public Mono<String> mostrarRecomendaciones(Model model, @AuthenticationPrincipal CustomUserDetails userDetails) {
        if (userDetails == null) {
            // Si no hay usuario autenticado, mostrar una página con mensaje o redirigir
            model.addAttribute("mensaje", "Debes iniciar sesión para ver tus recomendaciones");
            return Mono.just("login");
        }
        
        Usuario usuario = userDetails.getUsuario();
        
        // Usar la versión con DTOs para mejorar la tipificación
        return recomendacionService.obtenerRecomendacionesConDto(usuario)
                .map(recomendados -> {
                    model.addAttribute("recomendaciones", recomendados);
                    model.addAttribute("nombreUsuario", usuario.getNombre());
                    return "recomendaciones"; // tu vista thymeleaf
                })
                .onErrorResume(e -> {
                    model.addAttribute("error", "No pudimos obtener tus recomendaciones en este momento.");
                    return Mono.just("recomendaciones");
                });
    }
    
    // Método para refrescar recomendaciones (limpia la caché)
    @GetMapping("/libros/recomendaciones/refrescar")
    public Mono<String> refrescarRecomendaciones(Model model, @AuthenticationPrincipal CustomUserDetails userDetails) {
        if (userDetails == null) {
            return Mono.just("redirect:/login");
        }
        
        Usuario usuario = userDetails.getUsuario();
        // Limpiar caché de este usuario
        recomendacionService.limpiarCacheUsuario(usuario.getId());
        
        // Redirigir a recomendaciones
        return Mono.just("redirect:/libros/recomendaciones");
    }
}