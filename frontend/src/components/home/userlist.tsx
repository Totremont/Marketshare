import { ROLE_COMPRADOR, ROLE_VENDEDOR, USERNAME_HEADER, USER_ROLE_HEADER } from "@/middleware";
import { findAllOrdersByRoleSSA, findAllOrdersSSA, findAllProductsSSA, findAllUsersByRoleSSA, findUserByUsernameSSA } from "@/private/actions/home";
import { formToProduct, lastOrderStatus, toCategory } from "@/private/utils/mappers";
import { headers } from "next/headers";
import UserCard from "./clientside/usercard";
import { M_PLUS_1 } from "next/font/google";

export default async function UserList()
{
    const username = headers().get(USERNAME_HEADER)!;
    const userRole = headers().get(USER_ROLE_HEADER)!;
    const ownUser : any = await findUserByUsernameSSA(username); 
    const promise = userRole === ROLE_COMPRADOR ? findAllOrdersByRoleSSA(userRole,ownUser.id) : Promise.resolve([]);
    const [ownOrders, formProducts] : [any[],FormData] = await Promise.all(
        [promise,findAllProductsSSA()]  //Products are memoized
    );

    const products : any[] = formToProduct(formProducts);

    if(userRole === ROLE_COMPRADOR)  //Obtener sobre vendedores y sus productos
    {
        const [users, orders] : any[][] = await Promise.all([findAllUsersByRoleSSA(ROLE_VENDEDOR), findAllOrdersSSA()]);
        const views = users.map(user => 
            {
                const completedOrders = orders.filter(it => it.seller_id === user.id && lastOrderStatus(it).status === 'ENTREGADO');
                const userProducts = products.filter(it => Number(it.owner_id) === user.id);
                //Encontrar categorias más frecuentes --
                const categories = findMainCategories(userProducts);
                //He comprado sus productos?
                const amIClient = ownOrders.findIndex(it => it.seller_id === user.id) > -1;
                return <UserCard ordersCompleted={completedOrders.length} categories={categories} user={user} role={user.type} amIClient={amIClient} isClient={false}/>
            }
        )
        return views;

    } 
    else //Obtener sobre compradores y ordenes
    {
        const [users, orders] : any[][] = await Promise.all([findAllUsersByRoleSSA(ROLE_COMPRADOR), findAllOrdersSSA()]);
        const views = users.map(user => 
            {   
                const userOrders = orders.filter(it => it.client_id === user.id );
                const completedOrders = userOrders.filter(it => lastOrderStatus(it).status === 'ENTREGADO')
                const productsIds = userOrders.map(it => it.product_id);
                const userProducts = products.filter(it => productsIds.includes(Number(it.id)));
                //Encontrar categorias más frecuentes --
                const categories = findMainCategories(userProducts);
                const isClient = userOrders.findIndex(it => it.seller_id === ownUser.id ) > -1;
                return <UserCard ordersCompleted={completedOrders.length} categories={categories} user={user} role={user.type} amIClient={false} isClient={isClient}/>
            }
        )
        return views;
    }
    

}

function findMainCategories(products : any[])   //Encontrar categorias más frecuentes --
{
    let data : {category : string, ocurrency : number}[] = [];
    
    const categories = products.map(it => it.category.name).sort();   //[Autos,Autos,Autos,Belleza] etc
    let lastCategory = '';
    categories.forEach(it => 
        {
            if(it === lastCategory) data[data.length - 1].ocurrency++;
            else
            {
                data = data.concat({category : it, ocurrency : 1});
                lastCategory = it;
            }
        }
    );
    data.sort((a,b) => b.ocurrency - a.ocurrency);  //Si 'a' tiene más ocurrencias, 'a' va primero
    //Data is now sorted be category's ocurrency -- Show up to 5 categories
    return (data.length > 5 ? data.slice(0,5) : data)
    .map(it => {return {category : toCategory(it.category), ocurrency : it.ocurrency}});
}