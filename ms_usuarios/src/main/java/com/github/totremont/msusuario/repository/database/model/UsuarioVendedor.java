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
@Entity
@DiscriminatorValue("ROLE_VENDEDOR")
@Getter @Setter @NoArgsConstructor
public class UsuarioVendedor extends Usuario
{
    @ManyToOne
    @JoinColumn(name = "org_id")
    private Empresa organization;
    
    public UsuarioVendedor(String userName, String password, String email, Pais country, Empresa organization) {
        super(userName, password, email,country);
        this.organization = organization;
    }

    public UsuarioVendedor(Empresa organization, Long id, String name, String password, String email, Pais country) {
        super(id, name, password, email, country);
        this.organization = organization;
    }
    
    
    
    
    
    
    
}
