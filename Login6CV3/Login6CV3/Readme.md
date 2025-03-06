# 📚🎮 Sistema de Recomendaciones de Libros y Películas  

Este proyecto es una aplicación web desarrollada con **Spring Boot** y **Maven** que, en su versión actual, implementa un **CRUD de usuarios con gestión de sesiones seguras**.  
El sistema está diseñado para crecer y en el futuro recomendará **libros y películas** en función de las búsquedas de los usuarios.  

🚀 **Tecnologías utilizadas:**  
- **Java 17**  
- **Spring Boot 3**  
- **Maven**  
- **Spring Security**  
- **Thymeleaf**  
- **JPA/Hibernate**  
- **MySQL**  
- **Docker**  

---

## ⚙ **Instalación y Ejecución**  

### 📌 **Requisitos Previos**  
Antes de iniciar el proyecto, asegúrate de tener instalado:  
- **Java 17+**  
- **Maven**  
- **Docker**  
- **MySQL (si no usas Docker para la base de datos)**  

### 🛠 **Configuración de la Base de Datos**  
En el archivo `src/main/resources/application.properties`, configura tu base de datos:

```properties
spring.datasource.url=jdbc:mysql://localhost:3306/recomendaciones
spring.datasource.username=root
spring.datasource.password=tu_contraseña
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
```

---

## 🚀 **Ejecución Local (Sin Docker)**
Si deseas ejecutar la aplicación sin Docker:  

1️⃣ **Compila el proyecto:**  
```bash
mvn clean package
```

2️⃣ **Ejecuta la aplicación:**  
```bash
mvn spring-boot:run
```

La aplicación estará disponible en:  
📌 **http://localhost:8080**

---

## 🐵 **Despliegue con Docker**
Para ejecutar el proyecto en un contenedor **Docker**, sigue estos pasos:

### 📌 **1. Crear el `Dockerfile`**
El siguiente `Dockerfile` está incluido en el proyecto:

```dockerfile
# Usa una imagen de Java 17
FROM openjdk:17-jdk-slim

# Copia el JAR de la aplicación
COPY target/SistemaRecomendaciones.jar app.jar

# Expone el puerto 8080
EXPOSE 8080

# Ejecuta la aplicación
ENTRYPOINT ["java", "-jar", "/app.jar"]
```

### 📌 **2. Construir la imagen Docker**
Ejecuta el siguiente comando en la raíz del proyecto:

```bash
docker build -t sistema-recomendaciones .
```

### 📌 **3. Ejecutar el contenedor**
```bash
docker run -p 8080:8080 --name recomendaciones sistema-recomendaciones
```

La aplicación estará disponible en:  
📌 **http://localhost:8080**

---

## 🔒 **Gestión de Sesiones Seguras**
La aplicación usa **Spring Security** para gestionar sesiones seguras.  
Las principales rutas protegidas son:

👉 **Usuarios registrados:**  
- `/perfil` → Ver y actualizar perfil  
- `/logout` → Cerrar sesión  

👉 **Administradores:**  
- `/admin/usuarios` → Gestión de usuarios  

Si un usuario intenta acceder a `/admin/usuarios` sin el rol adecuado, será redirigido.

---

## Pruebas de funcionalidad

![Proyecto corriendo en Docker](static/img/image2.png)

![Pantalla de login](static/img/image2.png)

![Conexión a base de datos](static/img/image3.png)



## 🎯 **Futuras Mejoras**
✅ Implementar sistema de recomendaciones basado en búsquedas  
✅ Integrar API de libros y películas  
✅ Mejorar la interfaz de usuario  

---

## 🏆 **Autor**
👤 **Antony Horteales**  

