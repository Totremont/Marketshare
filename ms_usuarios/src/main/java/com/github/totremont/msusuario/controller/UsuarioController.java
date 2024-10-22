/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.github.totremont.msusuario.controller;

import com.github.totremont.msusuario.controller.dtos.UsuarioDTO;
import com.github.totremont.msusuario.repository.database.enums.UsuarioType;
import static com.github.totremont.msusuario.repository.database.enums.UsuarioType.COMPRADOR;
import com.github.totremont.msusuario.repository.database.model.Usuario;
import com.github.totremont.msusuario.repository.database.model.UsuarioComprador;
import com.github.totremont.msusuario.repository.database.model.UsuarioVendedor;
import com.github.totremont.msusuario.repository.database.utils.UsuarioUtils;
import com.github.totremont.msusuario.service.UsuarioService;
import java.util.Optional;
import java.util.List;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

/**
 *
 * @author ezequ
 */
@RestController
@CrossOrigin(origins = "*")
@RequestMapping("/api/users")
public class UsuarioController 
{
    
    private final UsuarioService service;

    public UsuarioController(UsuarioService service) {
        this.service = service;
    }
    
    //@Validated @RequestBody UsuarioDTO userDTO)
    //api/users?username=xxx | //api/users?role=xxx
    @GetMapping()
    public ResponseEntity<UsuarioDTO> findByUsername(
            @RequestHeader(HttpHeaders.AUTHORIZATION) String token, 
            @RequestParam String username)
    {
        Optional<Usuario> user = service.findByUsername(username);
        if(user.isPresent())
            return ResponseEntity.ok().body(UsuarioDTO.from(user.get()));
        else return ResponseEntity.notFound().build();
    }
    
    //api/users/list?role=xxx
    @GetMapping("/list")
    public ResponseEntity<List<UsuarioDTO>> findAllByRole(
            @RequestHeader(HttpHeaders.AUTHORIZATION) String token,
            @Validated @RequestParam String role)
    {
        UsuarioType type = UsuarioUtils.getTypeName(role);
        switch(type)
        {
            case COMPRADOR:
            {
                List<UsuarioComprador> users = service.findAllRoleComprador();
                List<UsuarioDTO> dtos = users.stream().map(it -> UsuarioDTO.from(it)).toList();
                if(!dtos.isEmpty())
                {
                    return ResponseEntity.ok().body(dtos);
                } else return ResponseEntity.notFound().build();
            }
            case VENDEDOR:
            {
                List<UsuarioVendedor> users = service.findAllRoleVendedor();
                List<UsuarioDTO> dtos = users.stream().map(it -> UsuarioDTO.from(it)).toList();
                if(!dtos.isEmpty())
                {
                    return ResponseEntity.ok().body(dtos);              
                } else return ResponseEntity.notFound().build();
            }
            default:
                return ResponseEntity.badRequest().build();  
        }
    }
    
    //api/users/{id}
    @GetMapping("/{id}") //api/users/{}
    public ResponseEntity<UsuarioDTO> findById(
            @RequestHeader(HttpHeaders.AUTHORIZATION) String token,
            @Validated @PathVariable Long id)
    {
        Optional<Usuario> user = service.findById(id);
        if(user.isPresent())
            return ResponseEntity.ok().body(UsuarioDTO.from(user.get()));
        else return ResponseEntity.notFound().build();
    }
    
    
    @PostMapping()
    public ResponseEntity<UsuarioDTO> save(
            @RequestHeader(HttpHeaders.AUTHORIZATION) String token,
            @Validated @RequestBody UsuarioDTO userDTO)
    {
        UsuarioType type = UsuarioUtils.getTypeName(userDTO.getType());
        UsuarioDTO newUser;
        switch(type)
        {
            case COMPRADOR:
            {
                Optional<UsuarioComprador> aux = 
                        service.save(
                                userDTO.getName(), userDTO.getPassword(),userDTO.getEmail(),userDTO.getCountry().getName(),
                                userDTO.getOrganization().getName(),userDTO.getBank().getName(),userDTO.getMoney());
                newUser = UsuarioDTO.from(aux.get());
                break;
            }
            case VENDEDOR:
            {
                Optional<UsuarioVendedor> aux = 
                        service.save(userDTO.getName(), userDTO.getPassword(),userDTO.getEmail(),userDTO.getCountry().getName(),
                                userDTO.getOrganization().getName());
                newUser = UsuarioDTO.from(aux.get());
                break;
            }
            default:
                return ResponseEntity.badRequest().build();            
        }
        return ResponseEntity.ok().body(newUser);
    }
    
    @PutMapping
    public ResponseEntity<UsuarioDTO> update(
            @RequestHeader(HttpHeaders.AUTHORIZATION) String token,
            @Validated @RequestBody UsuarioDTO userDTO)
    {
        UsuarioType type = UsuarioUtils.getTypeName(userDTO.getType());
        UsuarioDTO newUser;
        switch(type)
        {
            case COMPRADOR:
            {
                Usuario aux = 
                        service.update(userDTO.getId(),
                                userDTO.getName(), userDTO.getPassword(),userDTO.getEmail(),userDTO.getCountry().getName(),
                                userDTO.getOrganization().getName(),userDTO.getBank().getName(),userDTO.getMoney());
                newUser = UsuarioDTO.from(aux);
                break;
            }
            case VENDEDOR:
            {
                Usuario aux = 
                        service.update(userDTO.getId(), 
                                userDTO.getName(), userDTO.getPassword(),userDTO.getEmail(),userDTO.getCountry().getName(),
                                userDTO.getOrganization().getName());
                newUser = UsuarioDTO.from(aux);
                break;
            }
            default:
                return ResponseEntity.badRequest().build();            
        }
        return ResponseEntity.ok().body(newUser);
    }
    
    
}
