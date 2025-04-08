package com._CV3.Login6CV3.auth.service;

import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;

@Service
public class OpenLibraryService {

    private final WebClient webClient;
    private final String BASE_URL = "https://openlibrary.org";

    public OpenLibraryService(WebClient.Builder webClientBuilder) {
        this.webClient = webClientBuilder.baseUrl(BASE_URL).build();
    }

    // Método para buscar libros por título
    public Mono<Object> searchBooks(String query) {
        return webClient.get()
                .uri(uriBuilder -> uriBuilder
                        .path("/search.json")
                        .queryParam("q", query)
                        .build())
                .retrieve()
                .bodyToMono(Object.class);
    }

    // Método para obtener detalles de un libro por su OLID
    public Mono<Object> getBookDetails(String olid) {
        return webClient.get()
                .uri(uriBuilder -> uriBuilder
                        .path("/works/{olid}.json")
                        .build(olid))
                .retrieve()
                .bodyToMono(Object.class);
    }
}