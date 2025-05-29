package com._CV3.Login6CV3.auth.controllers;

import com._CV3.Login6CV3.auth.Entity.Busqueda;
import com._CV3.Login6CV3.auth.Entity.Usuario;
import com._CV3.Login6CV3.auth.repository.BusquedaRepository;
import com._CV3.Login6CV3.auth.service.CustomUserDetails;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

@RestController
public class BusquedaRestController {

    @Autowired
    private BusquedaRepository busquedaRepository;

    @PostMapping("/api/registrar-busqueda")
    public ResponseEntity<?> registrarBusqueda(
            @RequestBody Map<String, String> payload,
            @AuthenticationPrincipal CustomUserDetails userDetails) {

        Map<String, Object> response = new HashMap<>();

        // Verificar si hay usuario autenticado
        if (userDetails == null) {
            response.put("success", false);
            response.put("message", "Usuario no autenticado");
            return ResponseEntity.ok(response);
        }

        String query = payload.get("query");
        
        // Verificar que la consulta no esté vacía
        if (query == null || query.trim().isEmpty()) {
            response.put("success", false);
            response.put("message", "La consulta está vacía");
            return ResponseEntity.ok(response);
        }

        try {
            // Crear y guardar la búsqueda
            Usuario usuario = userDetails.getUsuario();
            Busqueda busqueda = new Busqueda();
            busqueda.setTermino(query);
            busqueda.setUsuario(usuario);
            busquedaRepository.save(busqueda);

            response.put("success", true);
            response.put("message", "Búsqueda registrada correctamente");
        } catch (Exception e) {
            response.put("success", false);
            response.put("message", "Error al registrar la búsqueda: " + e.getMessage());
        }

        return ResponseEntity.ok(response);
    }
}