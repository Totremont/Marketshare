/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.github.totremont.msusuario.controller.dtos;

import com.github.totremont.msusuario.repository.database.enums.UsuarioType;
import com.github.totremont.msusuario.repository.database.model.Usuario;
import com.github.totremont.msusuario.repository.database.model.UsuarioComprador;
import com.github.totremont.msusuario.repository.database.model.UsuarioVendedor;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 *
 * @author ezequ
 */
@Getter @Setter @NoArgsConstructor
public class UsuarioDTO {
    
    private Long id;
    private String name;
    private String password;
    private String type;
    
    private String email;
    private EmpresaDTO organization;
    private BancoDTO bank;
    private PaisDTO country;
    private Float money;

    public UsuarioDTO(String userName, String password, String type) {
        this.name = userName;
        this.password = password;
        this.type = type;
        
    }
    
    //CompradorDTO

    public UsuarioDTO(Long id, String name, String password, String type, String email, EmpresaDTO organization, BancoDTO bank, PaisDTO country, Float money) {
        this.id = id;
        this.name = name;
        this.password = password;
        this.type = type;
        this.email = email;
        this.organization = organization;
        this.bank = bank;
        this.country = country;
        this.money = money;
    }
    

    //Vendedor DTO

    public UsuarioDTO(Long id, String name, String password, String type, String email, PaisDTO country, EmpresaDTO organization) {
        this.id = id;
        this.name = name;
        this.password = password;
        this.type = type;
        this.email = email;
        this.country = country;
        this.organization = organization;
    }
    
  
    
    public static UsuarioDTO from(Usuario user)
    {
        if(user.getType() == UsuarioType.VENDEDOR){
            UsuarioVendedor aux = ((UsuarioVendedor) user);
            return new UsuarioDTO(user.getId(), user.getName(),
            user.getPassword(),user.getType().name(),user.getEmail(), PaisDTO.from(user.getCountry()),
                    EmpresaDTO.from(aux.getOrganization()));
        }
        else
        {            
            UsuarioComprador aux = ((UsuarioComprador) user);
            return new UsuarioDTO(aux.getId(), aux.getName(),
            aux.getPassword(),aux.getType().name(),aux.getEmail(),
                    EmpresaDTO.from(aux.getOrganization()),
                    BancoDTO.from(aux.getBank()),
                    PaisDTO.from(aux.getCountry()),
                    aux.getMoney());
        }
    }
             
    
}