/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.github.totremont.msusuario.controller.dtos;

import com.github.totremont.msusuario.repository.database.model.Pais;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 *
 * @author ezequ
 */
@Getter @Setter @NoArgsConstructor @AllArgsConstructor
public class PaisDTO {
    
    private Long id;
    private String name;
    private String code;
    
    public static PaisDTO from(Pais country)
    {
        return new PaisDTO(country.getId(),country.getName(),country.getCode());
    }
    
}
