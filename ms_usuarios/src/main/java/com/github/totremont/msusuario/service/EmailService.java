

package com.github.totremont.msusuario.service;

import com.github.totremont.msusuario.controller.dtos.MessageTemplate;
import com.github.totremont.msusuario.repository.database.enums.UsuarioType;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

@Component
public class EmailService 
{
    private final RabbitTemplate rabbitClient;
    
    @Value("${message_broker_exchange}")
    private String exchange;
    
    @Value("${message_queue}")
    private String key;
    
    private MessageTemplate message = new MessageTemplate();
    
    public EmailService(RabbitTemplate rabbitClient)
    {
        this.rabbitClient = rabbitClient;
    }
    
    public void sendAccountCreated(String receiver, String name, UsuarioType type)
    {
        try
        {
            this.message = new MessageTemplate(receiver,name,type.name());
            convertAndSend();
        }
        catch(Exception e)
        {
            System.out.println("Exception when trying to send email: " + e);
        }
    }
    
    @Scheduled(initialDelay = 500)
    private void convertAndSend()
    {
        rabbitClient.convertAndSend(this.exchange,this.key,this.message);
        
    }

}
