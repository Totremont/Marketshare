/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.github.totremont.msusuario.controller;

import com.github.totremont.msusuario.controller.dtos.BancoDTO;
import com.github.totremont.msusuario.repository.database.model.Banco;
import com.github.totremont.msusuario.service.BancoService;
import java.util.List;
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
@CrossOrigin()
@RequestMapping("/internal/banks")
public class BancoController {
    
    private final BancoService service;

    public BancoController(BancoService service) {
        this.service = service;
    }
    
    @GetMapping()
    public ResponseEntity<List<BancoDTO>> findAll(
            @RequestHeader(HttpHeaders.AUTHORIZATION) String token)
    {
        List<Banco> banks = service.findAll();
        List<BancoDTO> banksDTO = banks.stream().map((it) -> BancoDTO.from(it)).toList();
        
        return ResponseEntity.ok().body(banksDTO);
    }
    
}
