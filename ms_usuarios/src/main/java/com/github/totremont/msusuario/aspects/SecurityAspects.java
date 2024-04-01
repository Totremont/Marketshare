/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.github.totremont.msusuario.aspects;

import com.github.totremont.msusuario.controller.BancoController;
import com.github.totremont.msusuario.controller.EmpresaController;
import com.github.totremont.msusuario.controller.PaisController;
import com.github.totremont.msusuario.controller.UsuarioController;
import com.github.totremont.msusuario.controller.dtos.TokenDTO;
import com.github.totremont.msusuario.controller.dtos.UsuarioDTO;
import com.github.totremont.msusuario.controller.exceptions.CredentialsNotFoundException;
import com.github.totremont.msusuario.controller.exceptions.InvalidCredentialsException;
import java.util.ArrayList;
import java.util.Collection;
import java.util.List;
import org.aspectj.lang.JoinPoint;
import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.annotation.AfterReturning;
import org.aspectj.lang.annotation.Around;
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.annotation.Before;
import org.aspectj.lang.annotation.Pointcut;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Component;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;

/**
 *
 * @author ezequ
 */
@Aspect
@Component
public class SecurityAspects {
    
    @Value("${auth-server.key}")
    private String authKey;
    
    @Value("${clients.key}")
    private String clientKey;
    
    @Value("${auth-server.host}")
    private String authHost;
    
    //Target : Calling object | Proxy : Called object
    @Pointcut("execution(public * com.github.totremont.msusuario.controller.*.*(..))")
    public void apiRequest() {}
 
    @Around("apiRequest()")
    public ResponseEntity validate(ProceedingJoinPoint jp) throws Throwable
    {
        String token;
        String trailingText = "Bearer ";
        String clientText = "Basic "; 
        Boolean allowed = false;
        Object[] args = jp.getArgs();
        token = ((String) args[0]);
        
        if(token != null)
        {                   //Si es una consulta especial a la que se puede acceder con clientkey o authkey
            if  (
                        jp.getSignature().getName().equals("findByUsername") 
                    ||  jp.getTarget().getClass() == PaisController.class
                    ||  jp.getTarget().getClass() == EmpresaController.class
                    ||  jp.getTarget().getClass() == BancoController.class
                    ||  (jp.getTarget().getClass() == UsuarioController.class && jp.getSignature().getName().equals("save"))
                )
            {
                token = token.substring(clientText.length());
                if(token.equals(clientKey) || token.equals(authKey)) allowed = true;
            }
            
            if(!allowed)    //If was not allowed above
            {
                token = token.substring(trailingText.length());
                TokenDTO result = request(token).block();
                if(result == null || !result.getActive()) return ResponseEntity.status(401).build();
            }
            
        } else return ResponseEntity.badRequest().body("No token found");
        
        //Ejecutar el método
        try
        {
            ResponseEntity response = (ResponseEntity) jp.proceed();
            if(!token.equals(authKey) && jp.getTarget().getClass() == UsuarioController.class)
            {
                if(response.getStatusCode().is2xxSuccessful())
                {
                    if(List.class.isInstance(response.getBody()))   //If body is instance of list
                    {   
                        List<UsuarioDTO> dtos = (List<UsuarioDTO>) response.getBody();
                        dtos.stream().forEach(it -> {it.setPassword("");});
                    }
                    else
                    {
                        UsuarioDTO dto = (UsuarioDTO) response.getBody();
                        dto.setPassword("");
                    }
                }
            }  
        
            return response;
        } 
        catch(Exception e){ System.out.println(e); return ResponseEntity.badRequest().build(); }
    }
    
    
    private Mono<TokenDTO> request(String token)
    {
        WebClient client = WebClient.create(authHost);
        Mono<TokenDTO> response = client.method(HttpMethod.POST)
                .uri("/oauth/check_token")
                .accept(MediaType.APPLICATION_JSON)
                .header("Authorization", "Basic " + clientKey)
                .contentType(MediaType.APPLICATION_FORM_URLENCODED)
                .bodyValue("token=" + token)
                .retrieve()
                .onStatus(HttpStatusCode::is4xxClientError, (it) -> Mono.empty())
                .onStatus(HttpStatusCode::is5xxServerError,( it) -> Mono.empty())
                .bodyToMono(TokenDTO.class);
        return response;
    }       
    
}
