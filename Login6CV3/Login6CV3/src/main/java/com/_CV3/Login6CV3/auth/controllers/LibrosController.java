package com._CV3.Login6CV3.auth.controllers;

import com._CV3.Login6CV3.auth.service.OpenLibraryService;
import com._CV3.Login6CV3.auth.Entity.Busqueda;
import com._CV3.Login6CV3.auth.Entity.Usuario;
import com._CV3.Login6CV3.auth.repository.BusquedaRepository;
import com._CV3.Login6CV3.auth.service.CustomUserDetails;

import java.util.HashMap;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.security.core.annotation.AuthenticationPrincipal;

import reactor.core.publisher.Mono;



@Controller
public class LibrosController {

    private static final Logger log = LoggerFactory.getLogger(LibrosController.class);

    @Autowired
    private OpenLibraryService openLibraryService;

    @Autowired
    private BusquedaRepository busquedaRepository;

    @GetMapping("/libros")
    public String libros() {
        return "libros";
    }

    // Nuevo endpoint para buscar libros
    @GetMapping("/libros/buscar")
    public Mono<String> buscarLibros(
            @RequestParam(required = false) String title,
            @RequestParam(required = false) String author,
            @RequestParam(required = false) String subject,
            Model model,
            @AuthenticationPrincipal CustomUserDetails userDetails) {

        String query = buildQuery(title, author, subject); // Método que une los campos en un solo String
        if (userDetails != null && query != null && !query.trim().isEmpty()) {
            Busqueda busqueda = new Busqueda();
            busqueda.setTermino(query);
            busqueda.setUsuario(userDetails.getUsuario());
            busquedaRepository.save(busqueda);
        }
        return openLibraryService.searchBooks(query)
                .map(result -> {
                    model.addAttribute("resultados", result);
                    return "resultadosBusqueda";
                });
    }

    private String buildQuery(String title, String author, String subject) {
        StringBuilder query = new StringBuilder();
        if (title != null && !title.trim().isEmpty()) {
            query.append("title:").append(title.trim());
        }
        if (author != null && !author.trim().isEmpty()) {
            if (query.length() > 0) query.append(" ");
            query.append("author:").append(author.trim());
        }
        if (subject != null && !subject.trim().isEmpty()) {
            if (query.length() > 0) query.append(" ");
            query.append("subject:").append(subject.trim());
        }
        return query.toString();
    }

    // Nuevo endpoint para obtener detalles de un libro
    @GetMapping("/libros/detalles")
    public Mono<String> obtenerDetalles(@RequestParam String olid, Model model) {
        log.info("Solicitando detalles para el libro con OLID: {}", olid);
        
        return openLibraryService.getBookDetails(olid)
            .map(details -> {
                log.info("Detalles obtenidos correctamente para OLID: {}", olid);
                model.addAttribute("detalles", details);
                return "detallesLibro";
            })
            .onErrorResume(e -> {
                // Loguear el error
                log.error("Error al obtener detalles del libro {}: {}", olid, e.getMessage());
                    
                // Agregar atributos para mostrar error en la vista
                model.addAttribute("error", true);
                model.addAttribute("errorMessage", "No se pudieron cargar los detalles del libro: " + e.getMessage());
                model.addAttribute("olid", olid);
                
                return Mono.just("detallesLibro");
            });
    }
}