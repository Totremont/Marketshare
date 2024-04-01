/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.github.totremont.msusuario.controller.dtos;

import com.github.totremont.msusuario.repository.database.enums.UsuarioType;
import com.github.totremont.msusuario.repository.database.model.Usuario;
import com.github.totremont.msusuario.repository.database.model.UsuarioComprador;
import com.github.totremont.msusuario.repository.database.model.UsuarioVendedor;
import com.github.totremont.msusuario.repository.database.utils.UsuarioUtils;
import java.time.LocalDateTime;
import java.time.ZonedDateTime;
import java.time.format.DateTimeFormatter;
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
    private String registerDate;
    
    private static DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd'T'HH:mm:ss z");

    public UsuarioDTO(String userName, String password, String type) {
        this.name = userName;
        this.password = password;
        this.type = type;
        
    }
    
    //Subset de atributos que pueden actualizarse
    //Nombre, email, password, banco, money, country
    
    
    //CompradorDTO

    public UsuarioDTO(Long id, String name, String password, 
            String type, String email, EmpresaDTO organization, BancoDTO bank, 
            PaisDTO country, Float money, ZonedDateTime registerDate) {
        this.id = id;
        this.name = name;
        this.password = password;
        this.type = type;
        this.email = email;
        this.organization = organization;
        this.bank = bank;
        this.country = country;
        this.money = money;
        //YYYY-MM-DDTHH:mm:ss z (z = TimeZone)
        this.registerDate = registerDate.format(formatter);
    }
    

    //Vendedor DTO

    public UsuarioDTO(Long id, String name, String password, 
            String type, String email, PaisDTO country, EmpresaDTO organization, ZonedDateTime registerDate) {
        this.id = id;
        this.name = name;
        this.password = password;
        this.type = type;
        this.email = email;
        this.country = country;
        this.organization = organization;
        //YYYY-MM-DDTHH:mm:ss z (z = TimeZone)
        this.registerDate = registerDate.format(formatter);
    }
    
  
    
    public static UsuarioDTO from(Usuario user)
    {
        if(UsuarioUtils.getTypeName(user.getType()) == UsuarioType.VENDEDOR){
            UsuarioVendedor aux = ((UsuarioVendedor) user);
            return new UsuarioDTO(user.getId(), user.getName(),
            user.getPassword(),user.getType(),user.getEmail(), PaisDTO.from(user.getCountry()),
                    EmpresaDTO.from(aux.getOrganization()),aux.getRegisterDate());
        }
        else
        {            
            UsuarioComprador aux = ((UsuarioComprador) user);
            return new UsuarioDTO(aux.getId(), aux.getName(),
            aux.getPassword(),aux.getType(),aux.getEmail(),
                    EmpresaDTO.from(aux.getOrganization()),
                    BancoDTO.from(aux.getBank()),
                    PaisDTO.from(aux.getCountry()),
                    aux.getMoney(),aux.getRegisterDate());
        }
    }
             
    
}
