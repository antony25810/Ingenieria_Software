package com._CV3.Login6CV3.auth.service;

import com._CV3.Login6CV3.auth.dto.BusquedaResultadoDto;
import com._CV3.Login6CV3.auth.dto.LibroDto;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.web.reactive.function.client.WebClientResponseException;
import reactor.core.publisher.Mono;
import reactor.util.retry.Retry;

import java.time.Duration;
import java.util.Map;

@Service
public class OpenLibraryService {

    private static final Logger log = LoggerFactory.getLogger(OpenLibraryService.class);
    private final WebClient webClient;
    private final String BASE_URL = "https://openlibrary.org";

    public OpenLibraryService(WebClient.Builder webClientBuilder) {
        this.webClient = webClientBuilder.baseUrl(BASE_URL).build();
    }

    // Método para buscar libros por título usando DTO
    public Mono<BusquedaResultadoDto> searchBooksWithDto(String query) {
        log.info("Buscando libros con consulta: {}", query);
        return webClient.get()
                .uri(uriBuilder -> uriBuilder
                        .path("/search.json")
                        .queryParam("q", query)
                        .build())
                .retrieve()
                .bodyToMono(BusquedaResultadoDto.class)
                .doOnSuccess(result -> log.info("Búsqueda exitosa, encontrados {} resultados", 
                        result != null ? result.getNumFound() : 0))
                .doOnError(e -> log.error("Error en búsqueda de libros: {}", e.getMessage()))
                .retryWhen(Retry.backoff(2, Duration.ofSeconds(1))
                        .filter(throwable -> throwable instanceof WebClientResponseException &&
                                ((WebClientResponseException) throwable).getStatusCode().is5xxServerError()))
                .onErrorResume(e -> {
                    log.error("No se pudo completar la búsqueda: {}", e.getMessage());
                    return Mono.just(new BusquedaResultadoDto());
                });
    }

    public Mono<Object> searchBooks(String query) {
        log.info("Buscando libros (formato objeto) con consulta: {}", query);
        return webClient.get()
                .uri(uriBuilder -> uriBuilder
                        .path("/search.json")
                        .queryParam("q", query)
                        .build())
                .retrieve()
                .bodyToMono(Object.class)
                .doOnError(e -> log.error("Error en búsqueda de libros (formato objeto): {}", e.getMessage()))
                .retryWhen(Retry.backoff(2, Duration.ofSeconds(1))
                        .filter(throwable -> throwable instanceof WebClientResponseException &&
                                ((WebClientResponseException) throwable).getStatusCode().is5xxServerError()))
                .onErrorResume(e -> Mono.empty());
    }

    // Método para obtener detalles de un libro por su OLID con mejor manejo de errores
    public Mono<Map<String, Object>> getBookDetails(String olid) {
        log.info("Obteniendo detalles del libro con OLID: {}", olid);
        
        return webClient.get()
                .uri(uriBuilder -> uriBuilder
                        .path("/works/{olid}.json")
                        .build(olid))
                .retrieve()
                .bodyToMono(new ParameterizedTypeReference<Map<String, Object>>() {})
                .doOnSuccess(result -> log.info("Detalles obtenidos para libro: {}", olid))
                .doOnError(e -> log.error("Error al obtener detalles del libro {}: {}", olid, e.getMessage()));
    }
}