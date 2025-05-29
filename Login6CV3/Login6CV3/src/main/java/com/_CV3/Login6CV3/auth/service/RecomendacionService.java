package com._CV3.Login6CV3.auth.service;

import com._CV3.Login6CV3.auth.Entity.Busqueda;
import com._CV3.Login6CV3.auth.Entity.Usuario;
import com._CV3.Login6CV3.auth.dto.BusquedaResultadoDto;
import com._CV3.Login6CV3.auth.dto.LibroDto;
import com._CV3.Login6CV3.auth.repository.BusquedaRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.Cache;
import org.springframework.cache.CacheManager;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class RecomendacionService {

    private static final Logger log = LoggerFactory.getLogger(RecomendacionService.class);

    @Autowired
    private BusquedaRepository busquedaRepository;

    @Autowired
    private OpenLibraryService openLibraryService;
    
    @Autowired
    private CacheManager cacheManager;

    // Versión con caché usando anotación
    @Cacheable(value = "recomendaciones", key = "#usuario.id")
    public Mono<List<LibroDto>> obtenerRecomendacionesConDto(Usuario usuario) {
        log.info("Generando recomendaciones para usuario {}", usuario.getId());
        
        // Obtén los últimos 5 términos buscados por el usuario
        List<Busqueda> ultimasBusquedas = busquedaRepository.findTop5ByUsuarioOrderByFechaDesc(usuario);
        
        // Si no hay búsquedas, mostrar populares
        if (ultimasBusquedas.isEmpty()) {
            return obtenerLibrosPopularesConDto();
        }
        
        // Extrae los términos distintos
        List<String> terminos = ultimasBusquedas.stream()
                .map(Busqueda::getTermino)
                .distinct()
                .collect(Collectors.toList());
        
        // Usar hasta 3 términos más recientes para mantener relevancia
        List<String> terminosPrincipales = terminos.size() > 3 ? terminos.subList(0, 3) : terminos;
        
        log.info("Generando recomendaciones basadas en {} términos: {}", terminosPrincipales.size(), terminosPrincipales);
        
        // Combinar resultados de múltiples búsquedas
        return Flux.fromIterable(terminosPrincipales)
                .flatMap(termino -> openLibraryService.searchBooksWithDto(termino)
                        .onErrorResume(e -> {
                            log.error("Error al buscar libros con término '{}': {}", termino, e.getMessage());
                            return Mono.just(new BusquedaResultadoDto());
                        }))
                .collectList()
                .map(resultados -> {
                    // Procesar y combinar resultados
                    Set<String> keysUsados = new HashSet<>();
                    List<LibroDto> recomendaciones = new ArrayList<>();
                    
                    for (BusquedaResultadoDto resultado : resultados) {
                        if (resultado.getDocs() != null && !resultado.getDocs().isEmpty()) {
                            // Tomar como máximo 3 libros de cada búsqueda
                            for (LibroDto libro : resultado.getDocs().subList(0, Math.min(resultado.getDocs().size(), 3))) {
                                // Evitar duplicados basados en la clave única del libro
                                if (libro.getKey() != null && !keysUsados.contains(libro.getKey())) {
                                    keysUsados.add(libro.getKey());
                                    recomendaciones.add(libro);
                                }
                            }
                        }
                    }
                    
                    log.info("Se generaron {} recomendaciones únicas para usuario {}", 
                             recomendaciones.size(), usuario.getId());
                    
                    // Limitar el número total de recomendaciones
                    return recomendaciones.size() <= 5 ? recomendaciones : 
                           recomendaciones.subList(0, 5);
                });
    }
    
    // Versión alternativa con manejo manual de caché
    public Mono<List<LibroDto>> obtenerRecomendacionesConCacheManual(Usuario usuario) {
        String cacheKey = "rec_" + usuario.getId();
        Cache cache = cacheManager.getCache("recomendaciones");
        
        // Intentar obtener del caché
        if (cache != null) {
            List<LibroDto> cachedResult = cache.get(cacheKey, List.class);
            if (cachedResult != null && !cachedResult.isEmpty()) {
                log.info("Recuperando recomendaciones desde caché para usuario {}", usuario.getId());
                return Mono.just(cachedResult);
            }
        }
        
        // Si no hay en caché, generar nuevas recomendaciones
        return obtenerRecomendacionesConDto(usuario)
            .doOnSuccess(result -> {
                // Guardar en caché
                if (cache != null && result != null && !result.isEmpty()) {
                    log.info("Guardando {} recomendaciones en caché para usuario {}", 
                              result.size(), usuario.getId());
                    cache.put(cacheKey, result);
                }
            });
    }

    // Método para obtener libros populares usando DTO
    @Cacheable(value = "recomendaciones", key = "'populares'")
    private Mono<List<LibroDto>> obtenerLibrosPopularesConDto() {
        log.info("Obteniendo recomendaciones populares por defecto");
        return openLibraryService.searchBooksWithDto("best seller fiction")
                .map(resultado -> {
                    if (resultado.getDocs() != null && !resultado.getDocs().isEmpty()) {
                        List<LibroDto> populares = resultado.getDocs();
                        return populares.size() > 5 ? populares.subList(0, 5) : populares;
                    }
                    return Collections.<LibroDto>emptyList();
                })
                .onErrorResume(e -> {
                    log.error("Error al obtener libros populares: {}", e.getMessage());
                    return Mono.just(Collections.emptyList());
                });
    }

    @SuppressWarnings("unchecked")
    public Mono<List<Object>> obtenerRecomendaciones(Usuario usuario) {
        return obtenerRecomendacionesConDto(usuario)
                .map(libros -> (List<Object>)(Object)libros);
    }
    
    // Método para limpiar la caché de un usuario específico
    public void limpiarCacheUsuario(Long usuarioId) {
        Cache cache = cacheManager.getCache("recomendaciones");
        if (cache != null) {
            cache.evict(usuarioId);
            log.info("Caché de recomendaciones limpiada para usuario {}", usuarioId);
        }
    }
}