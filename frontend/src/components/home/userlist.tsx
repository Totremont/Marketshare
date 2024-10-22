import { ROLE_COMPRADOR, ROLE_VENDEDOR, USERNAME_HEADER, USER_ROLE_HEADER } from "@/middleware";
import { findAllOrdersByRoleSSA, findAllOrdersSSA, findAllProductsSSA, findAllUsersByRoleSSA, findUserByUsernameSSA } from "@/private/actions/home";
import { formToProduct, getOrderStatus, toCategory } from "@/private/utils/mappers";
import { headers } from "next/headers";
import UserCard from "./clientside/usercard";
import EmptyComponent from "./empty";

export default async function UserList()
{
    const username = headers().get(USERNAME_HEADER)!;
    const userRole = headers().get(USER_ROLE_HEADER)!;
    const ownUser : any = await findUserByUsernameSSA(username); 

    if(userRole === ROLE_COMPRADOR)  //Obtener sobre vendedores y sus productos
    {
        const [users, orders] : any[][] = await Promise.all([findAllUsersByRoleSSA(ROLE_VENDEDOR), findAllOrdersSSA()]);
        if(!users) return <EmptyComponent missingElement='vendedores'/>

        const formProducts = await findAllProductsSSA();
        const products = formToProduct(formProducts);

        const views = users.map(user => 
            {
                const completedOrders = orders.filter(it => it.seller_id === user.id && getOrderStatus(it).status === 'ENTREGADO');
                const userProducts = products.filter(it => Number(it.owner_id) === user.id);
                //Encontrar categorias más frecuentes --
                const categories = findMainCategories(userProducts);
                //He comprado sus productos?
                const amIClient = orders.findIndex(it => it.seller_id == user.id && it.client_id == ownUser.id) > -1;
                //const amIClient = ownOrders.findIndex(it => it.seller_id === user.id) > -1;
                return <UserCard ordersCompleted={completedOrders.length} categories={categories} user={user} role={user.type} amIClient={amIClient} isClient={false}/>
            }
        )
        return views;

    } 
    else //Obtener sobre compradores y ordenes
    {
        const [users, orders] : any[][] = await Promise.all([findAllUsersByRoleSSA(ROLE_COMPRADOR), findAllOrdersSSA()]);
        if(users.length == 0) return <EmptyComponent missingElement='compradores'/>

        const formProducts = await findAllProductsSSA();
        const products = formToProduct(formProducts);

        const views = users.map(user => 
            {   
                const userOrders = orders.filter(it => it.client_id === user.id );
                const completedOrders = userOrders.filter(it => getOrderStatus(it).status === 'ENTREGADO')
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

export function findMainCategories(products : any[])   //Encontrar categorias más frecuentes --
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