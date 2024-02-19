/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.github.totremont.msusuario.controller.dtos;

import com.github.totremont.msusuario.repository.database.model.Empresa;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 *
 * @author ezequ
 */
@Getter @Setter @NoArgsConstructor @AllArgsConstructor
public class EmpresaDTO {
    
    private Long id;
    
    private String name;

    public EmpresaDTO(String name) {
        this.name = name;
    }
    
    public static EmpresaDTO from(Empresa empresa)
    {
        return new EmpresaDTO(empresa.getId(), empresa.getName());
    }
    
    
    
}
