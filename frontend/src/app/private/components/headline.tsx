
export default function Headline(props : {date : string, 
    title : string, type : number, options : 
    {
        orgName : string, userName : string, price : number, userImage : string, message : string
    }})
{
    let body;
    let additional;
    let seller;
    let icon;

    switch(props.type)
    {
        case HeadlineType.NEW_PRODUCT:
            body = (
            <p className="text-sm mt-1">
            Vendedor: <b>{props.options.userName}</b><br/>
            Empresa: <b>{props.options.orgName}</b></p>
                    );
            additional = (<p className="text-end flex-1 text-lg text-green-200 font-semibold">${props.options.price}</p>);
            icon = "/new.svg";
            break;
        case HeadlineType.NEW_USER:
            body = (
            <p className="text-sm mt-1">
            Nombre: <b>{props.options.userName}</b><br/>
            Empresa: <b>{props.options.orgName}</b></p>
                    );
            additional = (<p className="text-end flex-1 text-sm text-orange-200 font-semibold ">¡Bienvenido!</p>);
            icon = "/greetings.svg";
            break;
        case HeadlineType.NEW_MESSAGE:
            body = (
            <p className="text-sm mt-1">{props.options.message}</p>);
            seller = (
            <div className="flex items-center">
                <p className="font-semibold flex-1 text-end me-2">{props.options.orgName}</p>
                <img src={props.options.userImage} 
                className="w-8 h-8 rounded-full aspect-auto"/>
            </div>);
            icon = "/notice.svg";
            break;

    }

    let view = (
    <article className="py-5 max-w-[250px] px-2 md:px-0 md:border-b border-slate-600 text-slate-200">  
      <div>
        <div className="flex items-center">
          <p className="text-sm text-slate-400">{props.date}</p>
          <img className="ms-2 text-yellow-100" src={icon}/>
        </div>
        <p className="font-semibold">{props.title}</p>
      </div>
      <div className="flex items-center my-2">
        {body}
        {additional}
      </div>
      {seller}
    </article>
    )

    return view;
}

export class HeadlineType
{
    static NEW_PRODUCT = 0;
    static NEW_USER = 1;
    static NEW_MESSAGE = 2;
}