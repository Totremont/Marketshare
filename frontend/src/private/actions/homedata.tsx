'use server'
//Todos estos métodos devuelven una lista o excepcion
//Comprador: lista de vendedores | Vendedor : viceversa  || Primeros 6

export async function findUser(username : string)
{
    try
    {
        let req = await fetch(`${process.env.NEXT_PUBLIC_ms_usuarios_host}/api/users?username=${username}`,
        { method : 'GET',
            mode : 'cors',
            headers: 
            {
            "Authorization":    `Basic ${process.env.NEXT_PUBLIC_clients_key}`,
            //"Content-Type":     "application/x-www-form-urlencoded",
            "Accept":           "application/json",
            },
        }
        );
        if(req.ok) return await req.json();
        else throw new Error(`Request for user by username resolved to ${req.status}`)
    } catch(e){throw e}
}

//Si soy un vendedor, me interesa obtener los compradores y viceversa
export async function findAllUsersByOppositeRole(role : string, token : string)
{
    try
    {
        let userRole;
        if(role === 'ROLE_VENDEDOR') userRole = 'ROLE_COMPRADOR'
        else userRole = 'ROLE_VENDEDOR';
        let req = await fetch(`${process.env.NEXT_PUBLIC_ms_usuarios_host}/api/users/list?role=${role}`,
        { 
            method : 'GET',
            mode : 'cors',
            headers: 
            {
            "Authorization":    `Bearer ${token}`,
            //"Content-Type":     "application/x-www-form-urlencoded",
            "Accept":           "application/json",
            },
        }
        );
        if(req.ok) return await req.json();
        else throw new Error(`Request for users resolved to ${req.status}`);
    } catch(e){throw e};

}

//Mis productos si soy vendedor | Todos si soy comprador || Primeros 6
export async function findAllProducts(token : string)
{
    try
    {
        let req = await fetch(`${process.env.NEXT_PUBLIC_ms_productos_host}/api/products/list`,
        { 
            method : 'GET',
            mode : 'cors',
            headers: 
            {
            "Authorization":    `Bearer ${token}`,
            //"Content-Type":     "application/x-www-form-urlencoded",
            "Accept":           "application/json",
            },
        }
        );
        if(req.ok) return await req.json();
        else throw new Error(`Request for products resolved to ${req.status}`);
    } catch(e){throw e};

}

//Mis ordenes (comprador o vendedor)
export async function findAllOrdersByRole(role : string, id : string, token : string)
{
    let request = (pathQuery : string, additionalQuery = '') => 
        fetch(`${process.env.NEXT_PUBLIC_ms_pedidos_host}/api/orders?${pathQuery}${additionalQuery ? '&' + additionalQuery : ''}`,
        { 
            method : 'GET',
            mode : 'cors',
            headers: 
            {
            "Authorization":    `Bearer ${token}`,
            //"Content-Type":     "application/x-www-form-urlencoded",
            "Accept":           "application/json",
            },
        }
    );
    try
    {
        switch(role)
        {
            case 'ROLE_COMPRADOR':
            {
                let req = await request(`client_id=${id}`);
                if(req.ok) return await req.json();
                else throw new Error(`Request for orders resolved to ${req.status}`);
            }
            case 'ROLE_VENDEDOR':
            {
                let req = await request(`seller_id=${id}`);
                if(req.ok) return await req.json();
                else throw new Error(`Request for orders resolved to ${req.status}`);
            }
            default:
                throw new Error(`Invalid role type while requesting orders`);
        }
    } catch(e){throw e};

}