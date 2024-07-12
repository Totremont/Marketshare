
import nodemailer from "nodemailer";
import { colors } from "./utils";

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

export async function sendGreetings(args : {receiver : string, name : string, accountType : string})
{
  let message = 
  {
    to : args.receiver,
    subject : "¡Bienvenido a marketshare!",
    text : `
    Eres un nuevo miembro de nuestra comunidad ❤️

    Bienvenido ${args.name},
    ¡Gracias por crear tu cuenta de ${args.accountType.toLowerCase()}!
    Ahora formás parte de la red de ventas B2B más grande del mundo.
    Da el siguiente paso y empezá a descubrir la lista de productos y empresas que te están esperando.
    
    Sinceramente, el equipo de marketshare con textRaw
    
    Este es un mensaje automático que no requiere respuesta`,
    html: `
    <div style="background: #111827; color: #F0FFFF; padding: 1.5rem; width: fit-content; height: fit-content;">
      <h1 style="">Eres un nuevo miembro de nuestra comunidad ❤️</h1>
      <p style="line-height: 1.5rem">
        Bienvenido <span style="font-weight: 600">${args.name}</span>,<br />¡Gracias por crear tu cuenta de ${args.accountType}!<br />
        Ahora formás parte de la red de ventas B2B más grande del mundo.<br />
        Da el siguiente paso y empezá a descubrir la lista de productos y empresas que te están esperando.
      </p>
      <span style="color: #FF8C00; font-weight: 600; background: #111827">Sinceramente, el equipo de <span>marketshare</span></span>
      <p style="font-size: 0.65rem; line-height: 1.25rem; color: #696969">Este es un mensaje automático que no requiere respuesta</p>
      <img src="https://i.imgur.com/mjxYRZg.png" style="width: 12rem; margin-top: 1.25rem;" />
    </div> `

  }
  return transporter.sendMail(message);
}

export async function sendOrderCreated(
  args : 
  {
    receiver : string, name : string
    details : {data : string, value : string}[], 
    cancelLink : string
  })
{
  let rawDetails : string = ""
  let styleDetails : string = ""
  args.details.forEach((it, index) => 
    {
      rawDetails = rawDetails.concat(`${it.data} : ${it.value}\n`)
      if(index < args.details.length - 1) //Si no es el último elemento
        styleDetails = styleDetails.concat(`${it.data}: <span style="font-weight: 600">${it.value}</span><br />`)
      else 
        styleDetails = styleDetails.concat(`${it.data}: <span style="font-weight: 600; color: ${colors.yellow}">${it.value}</span><br />`)
    })

  let message = {
    to : args.receiver,
    subject : "Tu pedido está en camino 🚚",
    text : `
    Hola ${args.name},
    Hemos confirmado tu última compra con los siguientes detalles:
    
    ${rawDetails}
    Te volveremos a informar de este pedido cuando se encuentre listo para llegar a tu organización.

    Para cancelar la transacción debes ir al siguiente vínculo: ${args.cancelLink}.

    Sinceramente, el equipo de marketshare

    Este es un mensaje automático que no requiere respuesta`,
    html: `
    <div style="background: #111827; color: #F0FFFF; padding: 1.5rem; width: fit-content; height: fit-content;">
      <h1 style="">Tu pedido está en camino 🚚</h1>
      <p style="line-height: 1.5rem">
        Hola <span style="font-weight: 600">${args.name}</span>,<br />Hemos confirmado tu última compra con los siguientes detalles:<br /><br />
        ${styleDetails}<br />
        Te volveremos a informar de este pedido cuando se encuentre listo para llegar a tu organización.
      </p>
      <p style="font-size: 0.75rem;  border-top: solid; padding-top: 1rem; border-color:#696969">Para cancelar la transacción hacé clic en el siguiente botón.</p>
      <form action="${args.cancelLink}">
        <input type="submit" value="Cancelar pedido" style="padding : 1rem; background: #2F4F4F; color: #DCDCDC; display:block;  margin-top: 2rem; margin-bottom: 2rem;" />
      </form>
      <span style="color: #FF8C00; font-weight: 600; background: #111827;">Sinceramente, el equipo de <span>marketshare</span></span>
      <p style="font-size: 0.65rem; line-height: 1.25rem; color: #696969;">Este es un mensaje automático que no requiere respuesta</p>
      <img src="https://i.imgur.com/mjxYRZg.png" style="width: 12rem; margin-top: 1.25rem;" />
    </div>
  `

  }
  return transporter.sendMail(message);
}

export async function sendOrderDelivered(
  args : {receiver : string, name : string
    details : {data : string, value : string}[], reviewLink : string})
{
  let rawDetails : string = ""
  let styleDetails : string = ""
  args.details.forEach((it, index) => 
    {
      rawDetails = rawDetails.concat(`${it.data} : ${it.value}\n`)
      if(index < args.details.length - 1) //Si no es el último elemento
        styleDetails = styleDetails.concat(`${it.data}: <span style="font-weight: 600">${it.value}</span><br />`)
      else 
        styleDetails = styleDetails.concat(`${it.data}: <span style="font-weight: 600; color: ${colors.green}">${it.value}</span><br />`)
    })

  let message = {
    to : args.receiver,
    subject : "¡Tu pedido ya llegó a su destino! 💫",
    text : `
    Hola ${args.name},
    Nos satisface anunciarte que tu pedido ha arribado a su destino.
    Te recordamos los detalles:
    
    ${rawDetails}
    ¡Gracias por confiar en marketshare!

    Si querés ayudar a otras personas a decidirse, podés dar tu opinión yendo al siguiente vínculo: ${args.reviewLink}

    Sinceramente, el equipo de marketshare

    Este es un mensaje automático que no requiere respuesta`,
    html: `
    <div style="background: #111827; color: #F0FFFF; padding: 1.5rem; width: fit-content; height: fit-content;">
    <h1 style="">¡Tu pedido ya llegó a su destino! 💫</h1>
    <p style="line-height: 1.5rem">
      Hola <span style="font-weight: 600">${args.name}</span>,<br />Nos satisface anunciarte que tu pedido ha arribado a su destino.<br />Te recordamos los detalles:<br /><br />
      ${styleDetails}<br />
      ¡Gracias por confiar en marketshare!
    </p>
    <p style="font-size: 0.75rem;  border-top: solid; padding-top: 1rem; border-color:#696969">Si querés ayudar a otras personas a decidirse, podés dar tu opinión haciendo clic en el siguiente botón.</p>
    <form action="${args.reviewLink}">
      <input type="submit" value="Reseñar producto" style="padding : 1rem; background: #2F4F4F; color: #DCDCDC; display:block;  margin-top: 2rem; margin-bottom: 2rem;" />
    </form> 
    <span style="color: #FF8C00; font-weight: 600; background: #111827;">Sinceramente, el equipo de <span>marketshare</span></span>
    <p style="font-size: 0.65rem; line-height: 1.25rem; color: #696969;">Este es un mensaje automático que no requiere respuesta</p>
    <img src="https://i.imgur.com/mjxYRZg.png" style="width: 12rem; margin-top: 1.25rem;" />
    </div>
  `

  }
  return transporter.sendMail(message);
}

export async function sendOrderCancelled(
  args : {receiver : string, name : string
    details : {data : string, value : string}[]})
{
  let rawDetails : string = ""
  let styleDetails : string = ""
  args.details.forEach((it, index) => 
    {
      rawDetails = rawDetails.concat(`${it.data} : ${it.value}\n`)
      if(index < args.details.length - 1) //Si no es el último elemento
        styleDetails = styleDetails.concat(`${it.data}: <span style="font-weight: 600">${it.value}</span><br />`)
      else 
        styleDetails = styleDetails.concat(`${it.data}: <span style="font-weight: 600; color: ${colors.red}">${it.value}</span><br />`)
    })

  let message = {
    to : args.receiver,
    subject : "Tu pedido ha sido cancelado ⚠️",
    text : `
    Hola ${args.name},
    Hemos recibido una alerta desde tu cuenta para anular el pedido con los siguientes detalles:

    ${rawDetails}
    Queremos informarte de que tu dinero ha sido restituído y el producto devuelto a su origen.
    Lamentamos los inconvenientes causados. 

    Sinceramente, el equipo de marketshare

    Este es un mensaje automático que no requiere respuesta`,
    html: `
    <div style="background: #111827; color: #F0FFFF; padding: 1.5rem; width: fit-content; height: fit-content;">
      <h1 style="">Tu pedido ha sido cancelado ⚠️</h1>
      <p style="line-height: 1.5rem">
        Hola <span style="font-weight: 600">${args.name}</span>,<br />Hemos recibido una alerta desde tu cuenta para anular el pedido con los siguientes detalles:<br /><br />
        ${styleDetails}<br />
        Queremos informarte de que tu dinero ha sido restituído y el producto devuelto a su origen.<br /> Lamentamos los inconvenientes causados.
      </p>
      <br />
      <span style="color: #FF8C00; font-weight: 600; background: #111827;">Sinceramente, el equipo de <span>marketshare</span></span>
      <p style="font-size: 0.65rem; line-height: 1.25rem; color: #696969;">Este es un mensaje automático que no requiere respuesta</p>
      <img src="https://i.imgur.com/mjxYRZg.png" style="width: 12rem; margin-top: 1.25rem;" />
  </div>          
  `
  }
  return transporter.sendMail(message);
}

export async function sendAccountChanged(args : {receiver : string})
{
  let message = 
  {
    to : args.receiver,
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
      <img src="https://i.imgur.com/mjxYRZg.png" style="width: 12rem; margin-top: 1.25rem;" />
    </div>
`
  }
  return transporter.sendMail(message);
}
