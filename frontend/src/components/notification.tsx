
export function NotificationComponent(props :
    {type : number, title : string, body : string, options : Array<NotificationOptions>})
{

    let informative = () => (
        <div className="fixed bottom-4 w-full ">
        <article className="text-[#FFFAFA] bg-[#4682B4] text-start 
        w-[400px] h-fit mx-auto p-3 rounded-lg shadow-sm shadow-slate-900">
        <p className="font-semibold">{props.title}</p>
        <p className="text-sm my-2">{props.body}</p>
        {
            props.options.map(it => (
                <button onClick={it.onClick} className=
                " text-sm font-semibold text-[#eedbff] me-3">{it.optionName}</button>
            ) )
        }
        </article>
        </div>
    )

    let error = () => (
        <div className="fixed bottom-4 w-full ">
        <article className="text-[#ffdad7] bg-[#A52A2A] text-start 
        w-[400px] h-fit mx-auto p-3 rounded-lg shadow-sm shadow-slate-900">
        <p className="font-semibold">{props.title}</p>
        <p className="text-sm my-2">{props.body}</p>
        {
            props.options.map(it => (
                <button onClick={it.onClick} className=
                " text-sm font-semibold text-[#eedbff] me-3">{it.optionName}</button>
            ) )
        }
        </article>
        </div>
    )

    let success = () => (
        <div className="fixed bottom-4 w-full ">
        <article className="text-[#d2e8d4] bg-[#2E8B57] text-start 
        w-[400px] h-fit mx-auto p-3 rounded-lg shadow-sm shadow-slate-900">
        <p className="font-semibold">{props.title}</p>
        <p className="text-sm my-2">{props.body}</p>
        {
            props.options.map(it => (
                <button onClick={it.onClick} className=
                " text-sm font-semibold text-[#eedbff] me-3">{it.optionName}</button>
            ) )
        }
        </article>
        </div>
    )
    
    switch(props.type)
    {
        case 0:
            return error()
        case 1:
            return informative()
        case 2:
            return success()
        default:
            return null;
    }
    
}

export class NotificationType
{
    static ERROR = 0
    static INFORMATIVE = 1
    static SUCCESSFUL = 2

    static NORMAL_TIME = 3000
    static LONG_TIME = 5000
}

export class NotificationOptions
{
    optionName : String;
    onClick : () => undefined;

    constructor(optionName : String, onClick : () => undefined)
    {
        this.optionName = optionName;
        this.onClick = onClick;
    }

}

 export class NotificationProps
{
  type : number;
  title : string;
  body : string;
  options : Array<NotificationOptions>

  constructor(type : number,title: string,body : string, options : Array<NotificationOptions>)
  {
    this.type = type;
    this.title = title;
    this.body = body;
    this.options = options;
  }
}

