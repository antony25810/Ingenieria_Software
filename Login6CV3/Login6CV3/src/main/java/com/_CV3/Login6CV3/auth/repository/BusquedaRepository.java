package com._CV3.Login6CV3.auth.repository;

import com._CV3.Login6CV3.auth.Entity.Busqueda;
import com._CV3.Login6CV3.auth.Entity.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface BusquedaRepository extends JpaRepository<Busqueda, Long> {
    List<Busqueda> findTop5ByUsuarioOrderByFechaDesc(Usuario usuario);
    // Opcional: buscar los términos más usados
}