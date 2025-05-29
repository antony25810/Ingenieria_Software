package com._CV3.Login6CV3.auth.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.util.List;

@JsonIgnoreProperties(ignoreUnknown = true)
public class BusquedaResultadoDto {
    private Integer numFound;
    private Integer start;
    private List<LibroDto> docs;

    // Getters y setters
    public Integer getNumFound() {
        return numFound;
    }

    public void setNumFound(Integer numFound) {
        this.numFound = numFound;
    }

    public Integer getStart() {
        return start;
    }

    public void setStart(Integer start) {
        this.start = start;
    }

    public List<LibroDto> getDocs() {
        return docs;
    }

    public void setDocs(List<LibroDto> docs) {
        this.docs = docs;
    }
}