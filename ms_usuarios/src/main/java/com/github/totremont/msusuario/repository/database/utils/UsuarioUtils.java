/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.github.totremont.msusuario.repository.database.utils;

import com.github.totremont.msusuario.repository.database.enums.UsuarioType;
import com.github.totremont.msusuario.repository.database.exceptions.InvalidUserTypeException;

/**
 *
 * @author ezequ
 */
public final class UsuarioUtils {
    
    static public UsuarioType getTypeName(String rawType)
    {
        UsuarioType type;
        switch(rawType)
        {
            case "COMPRADOR":
                type = UsuarioType.COMPRADOR;
                break;
            case "VENDEDOR":
                type = UsuarioType.VENDEDOR;
                break;
            default:
                throw new InvalidUserTypeException();
        }
        return type;
    }
    
    
    private UsuarioUtils(){};
    
}
