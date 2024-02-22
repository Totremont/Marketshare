import MessageType from "./MessageType";

const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport(
    {
        service: "gmail",
        secure: true,
        auth: {
            user: process.env.NODEMAILER_AC,
            pass: process.env.NODEMAILER_PW,
        },
        
    },
    {   //Valores por defecto en todos los mensajes
        from: `marketshare <${process.env.NODEMAILER_AC}>`
    });

export async function sendMessage(type : number, receiver : string)
{
    switch(type)
    {
        case MessageType.NEW_ACCOUNT:
        {
            let message = {
                to : receiver,
                subject : "¡Bienvenido a marketshare!",
                text : `
                Eres un nuevo miembro de nuestra comunidad ❤️

                Bienvenido Ezequiel,
                ¡Gracias por crear tu cuenta de comprador!
                Ahora formás parte de la red de ventas B2B más grande del mundo.
                Da el siguiente paso y empezá a descubrir la lista de productos y empresas que te están esperando.
                
                Sinceramente, el equipo de marketshare con textRaw
                
                Este es un mensaje automático que no requiere respuesta`,
                html: `
                <div style="background: #111827; color: #F0FFFF; padding: 1.5rem; width: fit-content; height: fit-content;">
                  <h1 style="">Eres un nuevo miembro de nuestra comunidad ❤️</h1>
                  <p style="line-height: 1.5rem">
                    Bienvenido <span style="font-weight: 600">Ezequiel</span>,<br />¡Gracias por crear tu cuenta de comprador!<br />
                    Ahora formás parte de la red de ventas B2B más grande del mundo.<br />
                    Da el siguiente paso y empezá a descubrir la lista de productos y empresas que te están esperando.
                  </p>
                  <span style="color: #FF8C00; font-weight: 600; background: #111827">Sinceramente, el equipo de <span>marketshare</span></span>
                  <p style="font-size: 0.65rem; line-height: 1.25rem; color: #696969">Este es un mensaje automático que no requiere respuesta</p>
                  <img src="https://i.imgur.com/mjxYRZg.png" style="background: #111827; width: 12rem; margin-top: 1.25rem;" />
                </div>
              `

            }
            return await transporter.sendMail(message);
        }
        case MessageType.ORDER_CREATED:
        {
          let message = {
            to : receiver,
            subject : "Tu pedido está en camino 🚚",
            text : `
            Hola Ezequiel,
            Hemos confirmado tu última compra con los siguientes detalles:

            Transacción: asdad04433245s
            Fecha: 05/12/22 15:30
            Producto: Redragon Zeus
            Cantidad: 5
            Precio: $4357
            Situación actual: RECIBIDO

            Te volveremos a informar de este pedido cuando se encuentre listo para llegar a tu organización.

            Para cancelar la transacción has clic en el siguiente vínculo: <link>.

            Sinceramente, el equipo de marketshare

            Este es un mensaje automático que no requiere respuesta`,
            html: `
            <div style="background: #111827; color: #F0FFFF; padding: 1.5rem; width: fit-content; height: fit-content;">
              <h1 style="">Tu pedido está en camino 🚚</h1>
              <p style="line-height: 1.5rem">
                Hola <span style="font-weight: 600">Ezequiel</span>,<br />Hemos confirmado tu última compra con los siguientes detalles:<br /><br />
                Transacción: <span style="font-weight: 600">asdad04433245s</span><br />
                Fecha: <span style="font-weight: 600">05/12/22 15:30</span><br />
                Producto: <span style="font-weight: 600">Redragon Zeus</span><br />
                Cantidad: <span style="font-weight: 600">5</span><br />
                Precio: <span style="font-weight: 600">$4357</span><br />
                Situación actual: <span style="font-weight: 600; color: #8FBC8F;">RECIBIDO</span><br /><br />
                Te volveremos a informar de este pedido cuando se encuentre listo para llegar a tu organización.
              </p>
              <p style="font-size: 0.75rem;  border-top: solid; padding-top: 1rem; border-color:#696969">Para cancelar la transacción has clic en el siguiente botón.</p>
              <button style="padding : 1rem; background: #2F4F4F; color: #DCDCDC; display:block;  margin-top:2rem; margin-bottom:2rem;" href="#">Cancelar pedido</button> 
              <span style="color: #FF8C00; font-weight: 600; background: #111827;">Sinceramente, el equipo de <span>marketshare</span></span>
              <p style="font-size: 0.65rem; line-height: 1.25rem; color: #696969;">Este es un mensaje automático que no requiere respuesta</p>
              <img src="https://i.imgur.com/mjxYRZg.png" style="background: #111827; width: 12rem; margin-top: 1.25rem;" />
            </div>
          `

          }
          return await transporter.sendMail(message);
        }
        case MessageType.ORDER_DELIVERED:
        {
          let message = {
            to : receiver,
            subject : "¡Tu pedido ya llegó a su destino! 💫",
            text : `
            Hola Ezequiel,
            Nos satisface anunciarte que tu pedido ha arribado a su destino.
            Te recordamos los detalles:

            Transacción: asdad04433245s
            Fecha: 05/12/22 15:30
            Producto: Redragon Zeus
            Cantidad: 5
            Precio: $4357
            Situación actual: ENTREGADO

            ¡Gracias por confiar en marketshare!

            Si querés ayudar a otras personas a decidirse, podés dar tu opinión haciendo clic en el siguiente vínculo: <link>

            Sinceramente, el equipo de marketshare

            Este es un mensaje automático que no requiere respuesta`,
            html: `
            <div style="background: #111827; color: #F0FFFF; padding: 1.5rem; width: fit-content; height: fit-content;">
              <h1 style="">¡Tu pedido ya llegó a su destino! 💫</h1>
              <p style="line-height: 1.5rem">
                Hola <span style="font-weight: 600">Ezequiel</span>,<br />Nos satisface anunciarte que tu pedido ha arribado a su destino.<br />Te recordamos los detalles:<br /><br />
                Transacción: <span style="font-weight: 600">asdad04433245s</span><br />
                Fecha: <span style="font-weight: 600">05/12/22 15:30</span><br />
                Producto: <span style="font-weight: 600">Redragon Zeus</span><br />
                Cantidad: <span style="font-weight: 600">5</span><br />
                Precio: <span style="font-weight: 600">$4357</span><br />
                Situación actual: <span style="font-weight: 600; color: #8FBC8F;">ENTREGADO</span><br /><br />
                ¡Gracias por confiar en marketshare!
              </p>
              <p style="font-size: 0.75rem;  border-top: solid; padding-top: 1rem; border-color:#696969">Si querés ayudar a otras personas a decidirse, podés dar tu opinión haciendo clic en el siguiente botón.</p>
              <button style="padding : 1rem; background: #2F4F4F; color: #DCDCDC; display:block;  margin-top:2rem; margin-bottom:2rem;" href="#">Reseñar producto</button> 
              <span style="color: #FF8C00; font-weight: 600; background: #111827;">Sinceramente, el equipo de <span>marketshare</span></span>
              <p style="font-size: 0.65rem; line-height: 1.25rem; color: #696969;">Este es un mensaje automático que no requiere respuesta</p>
              <img src="https://i.imgur.com/mjxYRZg.png" style="background: #111827; width: 12rem; margin-top: 1.25rem;" />
            </div>
          `

          }
          return await transporter.sendMail(message);
        }
        case MessageType.ORDER_CANCELLED:
        {
          let message = {
            to : receiver,
            subject : "¡Tu pedido ya llegó a su destino! 💫",
            text : `
            Hola Ezequiel,
            Hemos recibido una alerta desde tu cuenta para anular el pedido con los siguientes detalles:

            Transacción: asdad04433245s
            Fecha: 05/12/22 15:30
            Producto: Redragon Zeus
            Cantidad: 5
            Precio: $4357
            Situación actual: CANCELADO

            Queremos informarte de que tu dinero ha sido restituído y el producto devuelto a su origen.
            Lamentamos los inconvenientes causados. 

            Sinceramente, el equipo de marketshare

            Este es un mensaje automático que no requiere respuesta`,
            html: `
            <div style="background: #111827; color: #F0FFFF; padding: 1.5rem; width: fit-content; height: fit-content;">
              <h1 style="">Tu pedido ha sido cancelado ⚠️</h1>
              <p style="line-height: 1.5rem">
                Hola <span style="font-weight: 600">Ezequiel</span>,<br />Hemos recibido una alerta desde tu cuenta para anular el pedido con los siguientes detalles:<br /><br />
                Transacción: <span style="font-weight: 600">asdad04433245s</span><br />
                Fecha: <span style="font-weight: 600">05/12/22 15:30</span><br />
                Producto: <span style="font-weight: 600">Redragon Zeus</span><br />
                Cantidad: <span style="font-weight: 600">5</span><br />
                Precio: <span style="font-weight: 600">$4357</span><br />
                Situación actual: <span style="font-weight: 600; color: #CD5C5C;">CANCELADO</span><br /><br />
                Queremos informarte de que tu dinero ha sido restituído y el producto devuelto a su origen.<br /> Lamentamos los inconvenientes causados.
              </p>
              <br />
              <span style="color: #FF8C00; font-weight: 600; background: #111827;">Sinceramente, el equipo de <span>marketshare</span></span>
              <p style="font-size: 0.65rem; line-height: 1.25rem; color: #696969;">Este es un mensaje automático que no requiere respuesta</p>
              <img src="https://i.imgur.com/mjxYRZg.png" style="background: #111827; width: 12rem; margin-top: 1.25rem;" />
          </div>
          `

          }
          return await transporter.sendMail(message);
        }
        case MessageType.ACCOUNT_CHANGED:
        {
          let message = {
            to : receiver,
            subject : "Los datos de tu cuenta han cambiado ⚙️",
            text : `
            Querido usuario de marketshare,
            Te informamos que recientemente se han modificado algunos datos sensibles de tu cuenta.
            
            Si esta acción la realizaste vos, podés ignorar este mensaje.
            De lo contrario, te recomendamos cambiar inmediatamente tu contraseña y asegurarte de que tus datos personales (como tu información bancaria) no hayan sido comprometidos.
            
            Sinceramente, el equipo de marketshare
            
            Este es un mensaje automático que no requiere respuesta`,
            html: `
            <div style="background: #111827; color: #F0FFFF; padding: 1.5rem; width: fit-content; height: fit-content;">
              <h1 style="">Los datos de tu cuenta han cambiado ⚙️</h1>
              <p style="line-height: 1.5rem">
                Querido usuario de <span style="font-weight: 600">marketshare</span>,<br />Te informamos que recientemente se han modificado algunos datos sensibles de tu cuenta.<br /><br />Si esta acción la realizaste vos, podés ignorar este mensaje.<br />De lo contrario, te recomendamos cambiar inmediatamente tu contraseña y asegurarte de que tus datos personales (como tu información bancaria) no hayan sido comprometidos.
              </p>
              <br />
              <span style="color: #FF8C00; font-weight: 600; background: #111827;">Sinceramente, el equipo de <span>marketshare</span></span>
              <p style="font-size: 0.65rem; line-height: 1.25rem; color: #696969;">Este es un mensaje automático que no requiere respuesta</p>
              <img src="https://i.imgur.com/mjxYRZg.png" style="background: #111827; width: 12rem; margin-top: 1.25rem;" />
            </div>

          `

          }
          return await transporter.sendMail(message);
        }

    }
}
