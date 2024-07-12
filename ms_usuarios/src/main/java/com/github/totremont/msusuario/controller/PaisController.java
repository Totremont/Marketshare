/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.github.totremont.msusuario.controller;

import com.github.totremont.msusuario.controller.dtos.PaisDTO;
import java.util.List;
import com.github.totremont.msusuario.service.PaisService;
import com.github.totremont.msusuario.repository.database.model.Pais;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 *
 * @author ezequ
 */
@RestController
@CrossOrigin(origins = "*")
@RequestMapping("/api/countries")
public class PaisController {
    
    private final PaisService service;

    public PaisController(PaisService service) {
        this.service = service;
    }
      
    @GetMapping()
    public ResponseEntity<List<PaisDTO>> findAll(
            @RequestHeader(HttpHeaders.AUTHORIZATION) String token)
    {
        List<Pais> countries = service.findAll();
        List<PaisDTO> countriesDTO = countries.stream().map((it) -> PaisDTO.from(it)).toList();
        
        return ResponseEntity.ok().body(countriesDTO);
    }
    
}
