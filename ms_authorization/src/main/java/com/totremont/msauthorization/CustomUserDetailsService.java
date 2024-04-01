/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.totremont.msauthorization;

import com.totremont.msauthorization.dtos.UsuarioDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpMethod;
import org.springframework.http.MediaType;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.userdetails.User;
import org.springframework.stereotype.Component;
import reactor.core.publisher.Mono;

/**
 *
 * @author ezequ
 */
//@Component
public class CustomUserDetailsService implements UserDetailsService 
{
    @Value("${ms-users.host}")
    private String msUsersHost;
    
    @Value("${auth-server.key}")
    private String ownKey;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException 
    {
        try
        {
            UsuarioDTO userDTO = requestUser(username).block();

            UserDetails userDetails = User.builder()    //No codificamos la password porque ya está codificada en ms_usuarios
                    .username(username)
                    .password(userDTO.getPassword())
                    .roles(userDTO.getType().substring(5))           //Prefija con ROLE | ej: ROLE_vendedor
                    .build();
            
            return userDetails;
        }   
        catch(Exception e)
        {
            throw new UsernameNotFoundException("");
        }
    }
    
    private Mono<UsuarioDTO> requestUser(String name)
    {
        UsuarioDTO body = new UsuarioDTO();
        body.setName(name);
        WebClient client = WebClient.create(msUsersHost);
        Mono<UsuarioDTO> response = client.method(HttpMethod.GET)
                .uri(uriBuilder -> uriBuilder
                    .path("/api/users")
                    .queryParam("username", name)
                    .build())
                .header("Authorization", "Basic " + ownKey)
                .accept(MediaType.APPLICATION_JSON)
                .retrieve()
                .onStatus(HttpStatus::is4xxClientError,(it) -> Mono.empty())
                .onStatus(HttpStatus::is5xxServerError,(it) -> Mono.empty())
                .bodyToMono(UsuarioDTO.class);
        return response;
    }
    
    
    
    
    
    
}
