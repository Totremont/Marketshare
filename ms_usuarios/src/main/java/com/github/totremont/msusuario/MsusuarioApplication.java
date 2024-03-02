package com.github.totremont.msusuario;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.EnableAspectJAutoProxy;

@SpringBootApplication
@EnableAspectJAutoProxy
public class MsusuarioApplication {
   
    public static void main(String[] args) {
            SpringApplication.run(MsusuarioApplication.class, args);
    }

}
