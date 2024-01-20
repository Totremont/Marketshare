/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.github.totremont.msusuario.repository.database.model;

import jakarta.persistence.Column;
import jakarta.persistence.DiscriminatorValue;
import jakarta.persistence.Entity;
import jakarta.persistence.ManyToOne;

/**
 *
 * @author ezequ
 */

//Un usuario que representa una empresa compradora
@Entity
@DiscriminatorValue("buyer")
public class UsuarioComprador extends Usuario 
{
    @Column(nullable = false)
    @ManyToOne
    private Empresa organization;
    
    private UsuarioComprador(){}
    
    
}
