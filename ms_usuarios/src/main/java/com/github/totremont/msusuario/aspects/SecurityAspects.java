/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.github.totremont.msusuario.aspects;

import com.github.totremont.msusuario.controller.BancoController;
import com.github.totremont.msusuario.controller.EmpresaController;
import com.github.totremont.msusuario.controller.PaisController;
import com.github.totremont.msusuario.controller.dtos.TokenDTO;
import com.github.totremont.msusuario.controller.exceptions.CredentialsNotFoundException;
import com.github.totremont.msusuario.controller.exceptions.InvalidCredentialsException;
import org.aspectj.lang.JoinPoint;
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.annotation.Before;
import org.aspectj.lang.annotation.Pointcut;
import org.springframework.beans.factory.annotation.Value;
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
    
    @Value("${auth-server.key}")
    private String authKey;
    
    @Value("${clients.key}")
    private String clientKey;
    
    @Value("${auth-server.host}")
    private String authHost;
    
    //Target : Calling object | Proxy : Called object
    @Pointcut("execution(public * com.github.totremont.msusuario.controller.*.*(..))")
    public void apiRequest() {}
    
    @Before("apiRequest()")
    public void validate(JoinPoint jp) 
    {
        String token = null;
        String trailingText = "Bearer ";
        String clientText = "Basic ";       
        Object[] args = jp.getArgs();
        token = ((String) args[0]);
        
        if(token != null)
        {                   //Si es una consulta por usuario, solo auth puede hacerla
            if(jp.getSignature().getName().equals("findByUsername") )
            {
                token = token.substring(clientText.length());
                if(!token.equals(authKey)) throw new InvalidCredentialsException();
            }
                            //Si es por pais, banco u org, cualquier ms sin token
            else if(jp.getTarget().getClass() == PaisController.class
                    || jp.getTarget().getClass() == EmpresaController.class
                    || jp.getTarget().getClass() == BancoController.class)
            {
                token = token.substring(clientText.length());
                if(!token.equals(clientKey) && !token.equals(authKey)) throw new InvalidCredentialsException();
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
