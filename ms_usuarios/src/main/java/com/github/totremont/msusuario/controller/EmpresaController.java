/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.github.totremont.msusuario.controller;

import com.github.totremont.msusuario.controller.dtos.EmpresaDTO;
import com.github.totremont.msusuario.controller.dtos.UsuarioDTO;
import com.github.totremont.msusuario.service.EmpresaService;
import java.util.List;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import com.github.totremont.msusuario.repository.database.model.Empresa;

/**
 *
 * @author ezequ
 */
@RestController
@CrossOrigin()
@RequestMapping("/internal/organizations")
public class EmpresaController {
    
    private final EmpresaService service;

    public EmpresaController(EmpresaService service) {
        this.service = service;
    }
    
    @GetMapping()
    public ResponseEntity<List<EmpresaDTO>> findAll(
            @RequestHeader(HttpHeaders.AUTHORIZATION) String token)
    {
        List<Empresa> orgs = service.findAll();
        List<EmpresaDTO> orgsDTO = orgs.stream().map((it) -> EmpresaDTO.from(it)).toList();
        
        return ResponseEntity.ok().body(orgsDTO);
    }
    
}
