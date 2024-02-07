/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.github.totremont.msusuario.repository.database.model;

import jakarta.persistence.DiscriminatorValue;
import jakarta.persistence.Entity;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 *
 * @author ezequ
 */
@Entity
@DiscriminatorValue("VENDEDOR")
@Getter @Setter @NoArgsConstructor
public class UsuarioVendedor extends Usuario
{
    public UsuarioVendedor(String userName, String password, String email) {
        super(userName, password, email);
    }
    
    
    
}
