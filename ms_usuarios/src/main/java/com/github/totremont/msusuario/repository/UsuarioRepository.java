/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.github.totremont.msusuario.repository;

import com.github.totremont.msusuario.repository.database.model.Usuario;
import com.github.totremont.msusuario.repository.database.model.UsuarioComprador;
import com.github.totremont.msusuario.repository.database.model.UsuarioVendedor;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

/**
 *
 * @author ezequ
 */
@Repository
public interface UsuarioRepository extends JpaRepository<Usuario, Long>  {
    
    public Optional<Usuario> findOptionalByNameAndPassword(String userName, String password);
    
    @Query("SELECT u FROM Usuario u WHERE TYPE(u) = UsuarioVendedor")
    public List<UsuarioVendedor> getAllFromTypeVendedor();
    
    @Query("SELECT u FROM Usuario u WHERE TYPE(u) = UsuarioComprador")
    public List<UsuarioComprador> getAllFromTypeComprador();
    
}
