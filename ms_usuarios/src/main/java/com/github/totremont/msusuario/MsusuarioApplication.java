package com.github.totremont.msusuario;

import org.springframework.amqp.core.AnonymousQueue;
import org.springframework.amqp.core.Binding;
import org.springframework.amqp.core.BindingBuilder;
import org.springframework.amqp.core.DirectExchange;
import org.springframework.amqp.core.Queue;
import org.springframework.amqp.support.converter.Jackson2JsonMessageConverter;
import org.springframework.amqp.support.converter.MessageConverter;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.EnableAspectJAutoProxy;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableAspectJAutoProxy
@EnableScheduling
public class MsusuarioApplication {
   
    public static void main(String[] args) {
            SpringApplication.run(MsusuarioApplication.class, args);
    }
    
    @Value("${message_broker_exchange}")
    private String exchange;
    
    @Bean
    DirectExchange exchange() 
    {
        return new DirectExchange(this.exchange,true,false);
    }
    
    @Bean
    MessageConverter converter()
    {
        return new Jackson2JsonMessageConverter();
    }

}
