/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.github.totremont.msusuario.controller.dtos;

import com.github.totremont.msusuario.repository.database.model.Banco;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 *
 * @author ezequ
 */
@Getter @Setter @NoArgsConstructor @AllArgsConstructor
public class BancoDTO {
    
    private Long id;
    private String name;

    public BancoDTO(String name) {
        this.name = name;
    }
     
    
    public static BancoDTO from(Banco bank)
    {
        return new BancoDTO(bank.getId(), bank.getName());
    }
    
}
