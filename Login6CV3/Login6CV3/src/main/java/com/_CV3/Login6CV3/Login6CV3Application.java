package com._CV3.Login6CV3;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.boot.autoconfigure.domain.EntityScan;

@SpringBootApplication
@ComponentScan(basePackages = {
    "com._CV3.Login6CV3",
    "com._CV3.Login6CV3.auth.config",
    "com._CV3.Login6CV3.auth.controller",
    "com._CV3.Login6CV3.auth.entity",
    "com._CV3.Login6CV3.auth.repository",
    "com._CV3.Login6CV3.auth.service",
    "com._CV3.Login6CV3.auth.SistemaAutenticacion"
})
@EnableJpaRepositories(basePackages = "com._CV3.Login6CV3.auth.repository")
@EntityScan(basePackages = "com._CV3.Login6CV3.auth.Entity")
public class Login6CV3Application {
    
	public static void main(String[] args) {
        SpringApplication.run(Login6CV3Application.class, args);
    }
}
