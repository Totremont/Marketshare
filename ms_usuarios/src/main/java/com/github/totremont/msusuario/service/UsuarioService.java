/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.github.totremont.msusuario.service;

import com.github.totremont.msusuario.repository.UsuarioRepository;
import com.github.totremont.msusuario.repository.database.enums.UsuarioType;
import com.github.totremont.msusuario.repository.database.model.Banco;
import com.github.totremont.msusuario.repository.database.model.Empresa;
import com.github.totremont.msusuario.repository.database.model.Pais;
import com.github.totremont.msusuario.repository.database.model.Usuario;
import com.github.totremont.msusuario.repository.database.model.UsuarioComprador;
import com.github.totremont.msusuario.repository.database.model.UsuarioVendedor;
import java.util.Optional;
import java.util.List;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

/**
 *
 * @author ezequ
 */
@Service
public class UsuarioService {
    
    private final UsuarioRepository repo;
    private final EmpresaService empresaService;
    private final BancoService bancoService;
    private final PaisService paisService;
    private final EmailService emailService;
    
    private final PasswordEncoder encoder = new BCryptPasswordEncoder();

    public UsuarioService(UsuarioRepository repo, EmpresaService empresaService, BancoService bancoService, PaisService paisService, EmailService emailService) {
        this.repo = repo;
        this.empresaService = empresaService;
        this.bancoService = bancoService;
        this.paisService = paisService;
        this.emailService = emailService;
    }

    public Optional<Usuario> findByUsername(String name)
    {
        return repo.findOptionalByName(name.toLowerCase()); 
    }
    
    public Optional<Usuario> findById(Long id)
    {
        return repo.findById(id);
    }
    
    public List<UsuarioComprador> findAllRoleComprador()
    {
        return repo.findAllFromTypeComprador();
    }
    
    public List<UsuarioVendedor> findAllRoleVendedor()
    {
        return repo.findAllFromTypeVendedor();
    }
    
    
    //Save para comprador
    public Optional<UsuarioComprador> save(String name, String password, String email, String country, String organization, String bank, Float money)
    {
        Empresa empresa;
        Banco banco;
        Pais pais;
        UsuarioComprador user;
        
        System.out.printf("La contraseña indicada fue: %s", password);
        
        Optional<Empresa> empresaQuery = empresaService.findByName(organization);
        Optional<Banco> bancoQuery = bancoService.findByName(bank);
        Optional<Pais> paisQuery = paisService.findByName(country); //DEBE ESTAR CARGADO
        
        if(empresaQuery.isEmpty()) empresa = empresaService.save(organization);
        else empresa = empresaQuery.get();
        
        if(bancoQuery.isEmpty()) banco = bancoService.save(bank);
        else banco = bancoQuery.get();
        
        pais = paisQuery.get();

        user = new UsuarioComprador(empresa, banco, money, name.toLowerCase(), encoder.encode(password), email, pais);
        
        user = repo.save(user);
        
        emailService.sendAccountCreated(email, name, UsuarioType.COMPRADOR);
        
        return Optional.ofNullable(user);
        
        
    }
    
    //Save para vendedor
    public Optional<UsuarioVendedor> save(String name, String password, String email, String country, String organization)
    {      
        Pais pais;
        Empresa empresa;
        
        Optional<Pais> paisQuery = paisService.findByName(country);
        Optional<Empresa> empresaQuery = empresaService.findByName(organization);
        if(empresaQuery.isEmpty()) empresa = empresaService.save(organization);
        else empresa = empresaQuery.get();
        
        pais = paisQuery.get();
        
        UsuarioVendedor user = new UsuarioVendedor(name.toLowerCase(),encoder.encode(password),email,pais,empresa);      
        user = repo.save(user);
        
        emailService.sendAccountCreated(email, name, UsuarioType.VENDEDOR);
        
        return Optional.ofNullable(user);
        
    }
    
    //Update para vendedor
    public Usuario update(Long id, String name, String password, String email, String country, String organization)   //Todo
    {
        Pais pais;
        Empresa empresa;
        Optional<Pais> paisQuery = paisService.findByName(country);
        Optional<Empresa> empresaQuery = empresaService.findByName(organization);
        
        pais = paisQuery.get();
        empresa = empresaQuery.get();
        
        UsuarioVendedor user = new UsuarioVendedor(empresa,id,name.toLowerCase(),encoder.encode(password),email,pais); 
        return repo.update(user,encoder);
    }
    
    //Update para comprador
    public Usuario update(Long id, String name, String password, 
            String email, String country, String organization, String bank, Float money)
    {
        Empresa empresa;
        Banco banco;
        Pais pais;
        UsuarioComprador user;
        
        Optional<Empresa> empresaQuery = empresaService.findByName(organization);
        Optional<Banco> bancoQuery = bancoService.findByName(bank);
        Optional<Pais> paisQuery = paisService.findByName(country); //DEBE ESTAR CARGADO
        
        empresa = empresaQuery.get();
        
        if(bancoQuery.isEmpty()) banco = bancoService.save(bank);
        else banco = bancoQuery.get();
        
        pais = paisQuery.get();

        user = new UsuarioComprador(empresa,banco, money, id, name.toLowerCase(), encoder.encode(password), email, pais);
        
        return repo.update(user,encoder);
    }
    
   
}
