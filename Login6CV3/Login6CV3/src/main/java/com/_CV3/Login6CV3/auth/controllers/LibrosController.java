package com._CV3.Login6CV3.auth.controllers;

import com._CV3.Login6CV3.auth.service.OpenLibraryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import reactor.core.publisher.Mono;

@Controller
public class LibrosController {

    @Autowired
    private OpenLibraryService openLibraryService;

    @GetMapping("/libros")
    public String libros() {
        return "libros";
    }

    // Nuevo endpoint para buscar libros
    @GetMapping("/libros/buscar")
    public Mono<String> buscarLibros(@RequestParam String query, Model model) {
        return openLibraryService.searchBooks(query)
                .map(result -> {
                    model.addAttribute("resultados", result);
                    return "resultadosBusqueda"; // Vista para mostrar resultados
                });
    }

    // Nuevo endpoint para obtener detalles de un libro
    @GetMapping("/libros/detalles")
    public Mono<String> obtenerDetalles(@RequestParam String olid, Model model) {
        return openLibraryService.getBookDetails(olid)
                .map(details -> {
                    model.addAttribute("detalles", details);
                    return "detallesLibro"; // Vista para mostrar detalles
                });
    }
}