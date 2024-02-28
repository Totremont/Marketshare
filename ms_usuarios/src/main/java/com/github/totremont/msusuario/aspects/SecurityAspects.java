/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.github.totremont.msusuario.aspects;

import com.github.totremont.msusuario.controller.UsuarioController;
import com.github.totremont.msusuario.controller.dtos.TokenDTO;
import com.github.totremont.msusuario.controller.exceptions.CredentialsNotFoundException;
import com.github.totremont.msusuario.controller.exceptions.InvalidCredentialsException;
import org.aspectj.lang.JoinPoint;
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.annotation.Before;
import org.aspectj.lang.annotation.Pointcut;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.MediaType;
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
    
    //Target : Calling object | Proxy : Called object
    @Pointcut("execution(public * com.github.totremont.msusuario.controller.UsuarioController.*(..))")
    public void apiRequest() {}
    
    @Before("apiRequest()")
    public void validate(JoinPoint jp) 
    {
        String token = null;
        String trailingText = "Bearer ";
        String clientText = "Basic ";   //Los clientes (microservicios) pueden consultar la lista de usuarios solo con sus credenciales    
        Object[] args = jp.getArgs();
        for(int i = 0; i < args.length; i++)
        {
            Object arg = args[i];
            if(arg instanceof String)
            {
                token = arg.toString();
            }
        }
        if(token != null)
        {
            if(jp.getSignature().getName().equals("findByUsername"))
            {
                token = token.substring(clientText.length());
                //Credenciales de cliente en base64
                if(!token.equals("cHJ1ZWJhOmRhbg==")) throw new InvalidCredentialsException();
            }
            else
            {
                token = token.substring(trailingText.length());
                TokenDTO result = request(token).block();
                if(result == null || !result.getActive()) throw new InvalidCredentialsException();
            }
        } else throw new CredentialsNotFoundException();
    }
    
    
    private Mono<TokenDTO> request(String token)
    {
        WebClient client = WebClient.create("http://localhost:8020");
        Mono<TokenDTO> response = client.method(HttpMethod.POST)
                .uri("/oauth/check_token")
                .accept(MediaType.APPLICATION_JSON)
                .header("Authorization", "Basic cHJ1ZWJhOmRhbg==")
                .contentType(MediaType.APPLICATION_FORM_URLENCODED)
                .bodyValue("token=" + token)
                .retrieve()
                .onStatus(HttpStatusCode::is4xxClientError, (it) -> Mono.empty())
                .onStatus(HttpStatusCode::is5xxServerError,( it) -> Mono.empty())
                .bodyToMono(TokenDTO.class);
        return response;
    }

    
    
}
