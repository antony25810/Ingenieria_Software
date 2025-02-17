package mx.ipn.escom.HolaSpring5CV3.controllers;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class HolaMundoController {

    @GetMapping("/")
    public String holaMundo(Model model) {
        model.addAttribute("mensaje", "Hola Mundo");
        return "hola";  // Devuelve la vista hola.html
    }
}