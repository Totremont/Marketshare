/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.github.totremont.msusuario.service;

import com.github.totremont.msusuario.repository.UsuarioRepository;
import com.github.totremont.msusuario.repository.database.model.Empresa;
import com.github.totremont.msusuario.repository.database.model.Usuario;
import com.github.totremont.msusuario.repository.database.model.UsuarioComprador;
import com.github.totremont.msusuario.repository.database.model.UsuarioVendedor;
import java.util.Optional;
import org.springframework.stereotype.Service;

/**
 *
 * @author ezequ
 */
@Service
public class UsuarioService {
    
    private final UsuarioRepository repo;
    private final EmpresaService empresaService;

    public UsuarioService(UsuarioRepository userRepo, EmpresaService empresaService) {
        this.empresaService = empresaService;
        this.repo = userRepo;
    }
    
    public Optional<Usuario> findByNameAndPassword(String name, String password)
    {
        return repo.findOptionalByNameAndPassword(name,password);
        
    }
    
    
    //Save para comprador
    public Optional<UsuarioComprador> save(String name, String password, String email, String organization)
    {
        Empresa empresa;
        UsuarioComprador user;
        
        Optional<Empresa> query = empresaService.findByName(organization);
        
        if(query.isEmpty()) empresa = empresaService.save(organization);
        else empresa = query.get();
        
        user = new UsuarioComprador(empresa, name,password,email);
        
        user = repo.save(user);
        
        return Optional.ofNullable(user);
        
        
    }
    
    //Save para vendedor
    public Optional<UsuarioVendedor> save(String name, String password, String email)
    {      
        UsuarioVendedor user = new UsuarioVendedor(name,password,email);      
        user = repo.save(user);
        
        return Optional.ofNullable(user);
        
        
    }
    
   
}
