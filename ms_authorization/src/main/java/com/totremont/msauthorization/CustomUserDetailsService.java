/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.totremont.msauthorization;

import com.totremont.msauthorization.dtos.UsuarioDTO;
import org.springframework.http.HttpMethod;
import org.springframework.http.MediaType;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.userdetails.User;
import reactor.core.publisher.Mono;

/**
 *
 * @author ezequ
 */
public class CustomUserDetailsService implements UserDetailsService {

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException 
    {
        try
        {
            UsuarioDTO userDTO = request(username).block();

            UserDetails userDetails = User.withDefaultPasswordEncoder()
                    .username(username)
                    .password(userDTO.getPassword())
                    .roles(userDTO.getType())
                    .build();
            
            return userDetails;
        }   
        catch(Exception e)
        {
            throw new UsernameNotFoundException("");
        }
    }
    
    private Mono<UsuarioDTO> request(String name)
    {
        UsuarioDTO body = new UsuarioDTO();
        body.setName(name);
        WebClient client = WebClient.create("http://localhost:8080");
        Mono<UsuarioDTO> response = client.method(HttpMethod.GET)
                .uri("/internal/user")
                .accept(MediaType.APPLICATION_JSON)
                .bodyValue(body)
                .retrieve()
                .onStatus(HttpStatus::is4xxClientError,(it) -> Mono.empty())
                .onStatus(HttpStatus::is5xxServerError,(it) -> Mono.empty())
                .bodyToMono(UsuarioDTO.class);
        return response;
    }
    
    
    
    
    
    
}
