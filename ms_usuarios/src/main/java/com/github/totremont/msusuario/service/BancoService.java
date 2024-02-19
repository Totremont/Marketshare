/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.github.totremont.msusuario.service;

import com.github.totremont.msusuario.repository.BancoRepository;
import com.github.totremont.msusuario.repository.database.model.Banco;
import java.util.Optional;
import org.springframework.stereotype.Service;

/**
 *
 * @author ezequ
 */
@Service
public class BancoService {
    
    private final BancoRepository repo;

    public BancoService(BancoRepository repo) {
        this.repo = repo;
    }
    
    public Optional<Banco> findByName(String name)
    {
        return repo.findOptionalByName(name);
    }
    
    public Banco save(String name)
    {
        Banco entity = new Banco(name);
        return repo.save(entity);
    }
    
}
