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
@DiscriminatorValue("ROLE_COMPRADOR")
@Getter @Setter @NoArgsConstructor
public class UsuarioComprador extends Usuario 
{
    
    @ManyToOne
    @JoinColumn(name = "org_id")
    private Empresa organization; 
    
    @ManyToOne
    @JoinColumn(name = "bank_id")
    private Banco bank;
    
    private Float money;

    public UsuarioComprador(Empresa organization, Banco bank, Float money, String name, String password, String email, Pais country) {
        super(name, password, email, country);
        this.organization = organization;
        this.bank = bank;
        this.money = money;
    }

    public UsuarioComprador(Empresa organization, Banco bank, Float money, Long id, String name, String password, String email, Pais country) {
        super(id, name, password, email, country);
        this.organization = organization;
        this.bank = bank;
        this.money = money;
    }
    
    

    

    

    
    
    
    
}
