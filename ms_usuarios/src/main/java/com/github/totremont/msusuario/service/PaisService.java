/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.github.totremont.msusuario.service;

import com.github.totremont.msusuario.repository.PaisRepository;
import com.github.totremont.msusuario.repository.database.model.Pais;
import java.util.Optional;
import java.util.List;
import org.springframework.stereotype.Service;

/**
 *
 * @author ezequ
 */
@Service
public class PaisService {
    
    private final PaisRepository repo;

    public PaisService(PaisRepository repo) {
        this.repo = repo;
    }
    
    public Optional<Pais> findByName(String name)
    {
        return repo.findOptionalByName(name);
    }
    
    public Pais save(String name, String code)
    {
        Pais entity = new Pais(code,name);
        return repo.save(entity);
    }
    
    public List<Pais> findAll()
    {
        return repo.findAll();
    }
    
}
