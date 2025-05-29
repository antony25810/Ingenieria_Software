package com._CV3.Login6CV3.auth.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.util.List;

@JsonIgnoreProperties(ignoreUnknown = true)
public class LibroDto {
    private String key;
    private String title;
    private List<String> author_name;
    private Integer cover_i;
    private Integer first_publish_year;
    private List<String> subject;
    private List<Integer> publish_year;

    // Getters y setters
    public String getKey() {
        return key;
    }

    public void setKey(String key) {
        this.key = key;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public List<String> getAuthor_name() {
        return author_name;
    }

    public void setAuthor_name(List<String> author_name) {
        this.author_name = author_name;
    }

    public Integer getCover_i() {
        return cover_i;
    }

    public void setCover_i(Integer cover_i) {
        this.cover_i = cover_i;
    }

    public Integer getFirst_publish_year() {
        return first_publish_year;
    }

    public void setFirst_publish_year(Integer first_publish_year) {
        this.first_publish_year = first_publish_year;
    }

    public List<String> getSubject() {
        return subject;
    }

    public void setSubject(List<String> subject) {
        this.subject = subject;
    }

    public List<Integer> getPublish_year() {
        return publish_year;
    }

    public void setPublish_year(List<Integer> publish_year) {
        this.publish_year = publish_year;
    }

    // Método auxiliar para obtener el año de publicación (cualquiera disponible)
    public Integer getPublicationYear() {
        if (first_publish_year != null) {
            return first_publish_year;
        } else if (publish_year != null && !publish_year.isEmpty()) {
            return publish_year.get(0);
        }
        return null;
    }

    // Método auxiliar para obtener el ID del autor desde la clave
    public String getWorkId() {
        if (key != null && key.contains("/works/")) {
            return key.substring(key.lastIndexOf("/") + 1);
        }
        return key;
    }
}