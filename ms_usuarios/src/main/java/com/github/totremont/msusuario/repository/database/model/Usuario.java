/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.github.totremont.msusuario.repository.database.model;

import jakarta.persistence.Column;
import jakarta.persistence.DiscriminatorColumn;
import jakarta.persistence.DiscriminatorType;
import jakarta.persistence.DiscriminatorValue;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.Inheritance;
import jakarta.persistence.InheritanceType;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;
import java.io.Serializable;

/**
 *
 * @author ezequ
 */
@Table(uniqueConstraints = {@UniqueConstraint(columnNames={"user_name", "password"})})
@Entity
@Inheritance(strategy = InheritanceType.SINGLE_TABLE)
@DiscriminatorColumn (name="user_type", discriminatorType = DiscriminatorType.STRING)
@DiscriminatorValue("abstract")
public abstract class Usuario implements Serializable {
    
    @Id
    @GeneratedValue
    protected Long id;
    
    @Column(nullable = false, name ="user_name")
    protected String userName;
    
    @Column(nullable = false)
    protected String password;
    
    @Column(nullable = false)
    protected String email;
    
    
}
