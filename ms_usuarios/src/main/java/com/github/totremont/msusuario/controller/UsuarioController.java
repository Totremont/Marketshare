/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.github.totremont.msusuario.controller;

import com.github.totremont.msusuario.controller.dtos.UsuarioDTO;
import com.github.totremont.msusuario.repository.database.enums.UsuarioType;
import com.github.totremont.msusuario.repository.database.model.Usuario;
import com.github.totremont.msusuario.repository.database.model.UsuarioComprador;
import com.github.totremont.msusuario.repository.database.model.UsuarioVendedor;
import com.github.totremont.msusuario.repository.database.utils.UsuarioUtils;
import com.github.totremont.msusuario.service.UsuarioService;
import java.util.Optional;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 *
 * @author ezequ
 */
@RestController
@RequestMapping("/internal/user")
public class UsuarioController 
{
    
    private final UsuarioService service;

    public UsuarioController(UsuarioService service) {
        this.service = service;
    }
    
    
    @GetMapping()
    public ResponseEntity<UsuarioDTO> validateUser(@Validated @RequestBody UsuarioDTO userDTO)
    {
        Optional<Usuario> user = service.findByNameAndPassword(userDTO.getName(),userDTO.getPassword());
        if(user.isPresent())
            return ResponseEntity.ok().body(UsuarioDTO.from(user.get()));
        else return ResponseEntity.notFound().build();
    }
    
    @PostMapping()
    public ResponseEntity<UsuarioDTO> saveUser(@Validated @RequestBody UsuarioDTO userDTO)
    {
        UsuarioType type = UsuarioUtils.getTypeName(userDTO.getType());
        UsuarioDTO newUser;
        switch(type)
        {
            case COMPRADOR:
            {
                Optional<UsuarioComprador> aux = 
                        service.save(userDTO.getName(), userDTO.getPassword(),userDTO.getEmail(),
                                userDTO.getOrganization().getName());
                newUser = UsuarioDTO.from(aux.get());
                break;
            }
            case VENDEDOR:
            {
                Optional<UsuarioVendedor> aux = 
                        service.save(userDTO.getName(), userDTO.getPassword(),userDTO.getEmail());
                newUser = UsuarioDTO.from(aux.get());
                break;
            }
            default:
                return ResponseEntity.badRequest().build();            
        }
        return ResponseEntity.ok().body(newUser);
    }
    
}
