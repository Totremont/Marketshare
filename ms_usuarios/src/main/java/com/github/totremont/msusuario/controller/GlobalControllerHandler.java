/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.github.totremont.msusuario.controller;

import com.github.totremont.msusuario.repository.database.exceptions.InvalidUserTypeException;
import java.io.IOException;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

/**
 *
 * @author ezequ
 * Este controlador mantiene métodos que se encargan de interceptar excepciones ocurridas en cualquier otro método
 * de clases RestController y enviar una respuesta apropiada
 */
@ControllerAdvice
public class GlobalControllerHandler {
    
  @ExceptionHandler(InvalidUserTypeException.class)
  public ResponseEntity<String> invalidUserTypeHandler(InvalidUserTypeException ex) 
  {
      return ResponseEntity.badRequest().body("Invalid user type");
  }
  
  @ExceptionHandler(IllegalArgumentException.class)
  public ResponseEntity<String> illegalArgumentHandler(IllegalArgumentException ex) 
  {
      return ResponseEntity.badRequest().body("Illegal argument exception");
  }
  
  @ExceptionHandler({IOException.class, Exception.class})
  public ResponseEntity<String> ioHandler(Exception ex) 
  {
      System.out.println(ex);
      return ResponseEntity.internalServerError().build();
  }
  
  
}