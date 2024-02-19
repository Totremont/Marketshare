/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.github.totremont.msusuario.repository;

import com.github.totremont.msusuario.repository.database.model.Empresa;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

/**
 *
 * @author ezequ
 */
@Repository
public interface EmpresaRepository extends JpaRepository<Empresa, Long> {
    
    public Optional<Empresa> findOptionalByName(String name);
    
}
