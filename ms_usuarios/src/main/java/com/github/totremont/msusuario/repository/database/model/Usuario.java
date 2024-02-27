/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.github.totremont.msusuario.repository.database.model;

import com.github.totremont.msusuario.repository.database.enums.UsuarioType;
import com.github.totremont.msusuario.repository.database.utils.UsuarioUtils;
import jakarta.persistence.Column;
import jakarta.persistence.DiscriminatorColumn;
import jakarta.persistence.DiscriminatorType;
import jakarta.persistence.DiscriminatorValue;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Inheritance;
import jakarta.persistence.InheritanceType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import jakarta.persistence.Transient;
import jakarta.persistence.UniqueConstraint;
import java.io.Serializable;
import lombok.Getter;
import lombok.Setter;

/**
 *
 * @author ezequ
 */
@Table(uniqueConstraints = {@UniqueConstraint(columnNames={"name", "password"})})
@Entity
@Inheritance(strategy = InheritanceType.SINGLE_TABLE)
@DiscriminatorColumn (name="user_type", discriminatorType = DiscriminatorType.STRING)
@DiscriminatorValue("abstract")
@Getter @Setter
public abstract class Usuario implements Serializable {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    protected Long id;
    
    @Column(nullable = false, unique = true)
    protected String name;
    
    @Column(nullable = false)
    protected String password;
    
    @Column(nullable = false)
    protected String email;
    
    @ManyToOne
    @JoinColumn(name = "country_id",nullable = false)
    protected Pais country;
    
    @Transient
    public UsuarioType getType() 
    {
        String rawType = this.getClass().getAnnotation(DiscriminatorValue.class).value();
        return UsuarioUtils.getTypeName(rawType);
    }

    protected Usuario(String name, String password, String email, Pais country) {
        this.name = name;
        this.password = password;
        this.email = email;
        this.country = country;
    }

    protected Usuario(Long id, String name, String password, String email, Pais country) {
        this.id = id;
        this.name = name;
        this.password = password;
        this.email = email;
        this.country = country;
    }
    
    
    
    protected Usuario(){};
    
    
    
    
}
