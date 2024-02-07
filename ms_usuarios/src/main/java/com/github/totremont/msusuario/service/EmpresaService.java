/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.github.totremont.msusuario.service;

import com.github.totremont.msusuario.repository.EmpresaRepository;
import com.github.totremont.msusuario.repository.database.model.Empresa;
import java.util.Optional;
import org.springframework.stereotype.Service;

/**
 *
 * @author ezequ
 */
@Service
public class EmpresaService {
    
    private final EmpresaRepository repo;

    public EmpresaService(EmpresaRepository repo) {
        this.repo = repo;
    }
    
    public Optional<Empresa> findByName(String name)
    {
        return repo.findOptionalByName(name);
    }
    
    public Empresa save(String name)
    {
        Empresa entity = new Empresa(name);
        return repo.save(entity);
    }
    
}
