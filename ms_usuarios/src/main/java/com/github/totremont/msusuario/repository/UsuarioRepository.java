/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.github.totremont.msusuario.repository;

import com.github.totremont.msusuario.repository.database.exceptions.EntityNotFoundException;
import com.github.totremont.msusuario.repository.database.exceptions.InvalidUserTypeException;
import com.github.totremont.msusuario.repository.database.model.Usuario;
import com.github.totremont.msusuario.repository.database.model.UsuarioComprador;
import com.github.totremont.msusuario.repository.database.model.UsuarioVendedor;
import com.github.totremont.msusuario.repository.database.utils.UsuarioUtils;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

/**
 *
 * @author ezequ
 */
@Repository
public interface UsuarioRepository extends JpaRepository<Usuario, Long>  {
    
    public Optional<Usuario> findOptionalByName(String userName);
    
    @Query("SELECT u FROM Usuario u WHERE TYPE(u) = UsuarioVendedor ORDER BY u.registerDate DESC")
    public List<UsuarioVendedor> findAllFromTypeVendedor();
    
    @Query("SELECT u FROM Usuario u WHERE TYPE(u) = UsuarioComprador ORDER BY u.registerDate DESC")
    public List<UsuarioComprador> findAllFromTypeComprador();
    
    @Transactional  //Al ser transactional se debería actualizar la entidad al finalizar el método automáticamente
    default public Usuario update(Usuario user, PasswordEncoder encoder)
    {
        Optional<Usuario> entity = findById(user.getId());
        if(entity.isPresent())
        {
            switch(UsuarioUtils.getTypeName(entity.get().getType()))
            {
                case COMPRADOR:
                {
                    UsuarioComprador aux = ((UsuarioComprador) entity.get()); 
                    UsuarioComprador newUser = ((UsuarioComprador) user); 
                    aux.setName(newUser.getName());
                    //if(newUser.getPassword() != null && newUser.getPassword() != "")
                    //    aux.setPassword(encoder.encode(newUser.getPassword()));
                    aux.setEmail(newUser.getEmail());
                    aux.setCountry(newUser.getCountry());
                    aux.setBank((newUser.getBank()));
                    aux.setMoney(newUser.getMoney());  
                    return aux;
                }
                case VENDEDOR:
                {
                    UsuarioVendedor aux = ((UsuarioVendedor) entity.get()); 
                    UsuarioVendedor newUser = ((UsuarioVendedor) user); 
                    aux.setName(newUser.getName());
                    //if(newUser.getPassword() != null && newUser.getPassword() != "")
                    //    aux.setPassword(encoder.encode(newUser.getPassword()));
                    aux.setEmail(newUser.getEmail());
                    aux.setCountry(newUser.getCountry());
                    return aux;
                    
                }
                
                default: throw new InvalidUserTypeException();
            }
        } else throw new EntityNotFoundException();
    }
    
}
