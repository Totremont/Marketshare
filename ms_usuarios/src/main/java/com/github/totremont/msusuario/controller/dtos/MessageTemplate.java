
package com.github.totremont.msusuario.controller.dtos;

import java.io.Serializable;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter @Setter @NoArgsConstructor
public class MessageTemplate implements Serializable
{
    public String receiver;
    public String name;
    public String accountType;

    public MessageTemplate(String receiver, String name, String type) 
    {
        this.receiver = receiver;
        this.name = name;
        this.accountType = type;
    }

}
