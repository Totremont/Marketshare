/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.github.totremont.msusuario.repository.database.model;

import jakarta.persistence.DiscriminatorValue;
import jakarta.persistence.Entity;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 *
 * @author ezequ
 */

//Un usuario que representa una empresa compradora
@Entity
@DiscriminatorValue("COMPRADOR")
@Getter @Setter @NoArgsConstructor
public class UsuarioComprador extends Usuario 
{
    
    @ManyToOne
    @JoinColumn(name = "org_id")
    private Empresa organization;   

    public UsuarioComprador(Empresa organization, String userName, String password, String email) {
        super(userName, password, email);
        this.organization = organization;
    }

    
    
    
    
}
