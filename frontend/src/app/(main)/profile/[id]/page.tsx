import { findMainCategories } from "@/components/home/userlist";
import { LockIcon } from "@/components/icons/miscellaneous";
import { PrivatePage } from "@/components/private";
import ProductInfo from "@/components/product/page/info";
import ProfileInfo from "@/components/profile/info";
import { ROLE_COMPRADOR, ROLE_VENDEDOR, USERNAME_HEADER, USER_ROLE_HEADER } from "@/middleware";
import { findAllOrdersByRoleSSA, findAllProductsSSA, findAllUsersByRoleSSA, findUserByUsernameSSA } from "@/private/actions/home";
import { formToProduct, formatDate, formatPrice, toCategory } from "@/private/utils/mappers";
import { headers } from "next/headers";

export default async function ProfilePage({ params }: { params: { id: string } })
{
    const username = headers().get(USERNAME_HEADER)!;
    const userRole = headers().get(USER_ROLE_HEADER)!;
    const ownUser = await findUserByUsernameSSA(username);

    if(ownUser.id != params.id) return <PrivatePage title="No puedes ver el perfil de otro usuario"/>

    let users = [];

    let [orders,formProducts, sellers, clients] : [any[], FormData, any[], any[]] = await 
    Promise.all([findAllOrdersByRoleSSA(userRole,ownUser.id),findAllProductsSSA(), findAllUsersByRoleSSA(ROLE_VENDEDOR),findAllUsersByRoleSSA(ROLE_COMPRADOR)]);  
    users = sellers.concat(clients);
    
    const products = formToProduct(formProducts);
    let suggestProducts : any[] = [];
    let suggestDTO : {name : string, stock : string, price : string, published : string, seller : any, orders : any[], category : string} = [];

    let ownProducts : any[] = [];   //Productos de vendedor
    let ownDTO : {name : string, stock : string, price : string, published : string, seller : any, orders : any[], category : string} = [];

    let mainCategories : {category : string, ocurrency : number}[] = [];

    if(userRole === ROLE_COMPRADOR)
    {
        const ids = orders.map(it => it.product_id);
        const productsBought = products.filter(it => ids.includes(Number(it.id)));
        mainCategories = findMainCategories(productsBought);
        suggestProducts = products.filter(it => !productsBought.includes(it));

        //Ordenar productos sugeridos por preferencia.
        suggestProducts.sort((a,b) => 
        {
            const categoryA = toCategory(a.category.name);
            const categoryB = toCategory(b.category.name);
            const ocurrencyOfA = mainCategories.find(it => it.category === categoryA)?.ocurrency ?? 0;
            const ocurrencyOfB = mainCategories.find(it => it.category === categoryB)?.ocurrency ?? 0;
            return ocurrencyOfB - ocurrencyOfA; //Si a es más grande, va primero.
        })

        suggestDTO = suggestProducts.map(it => 
            {
                return {
                    name : it.name, published : formatDate(it.published), stock : it.stock, price : formatPrice(it.price),
                    seller : users.find(user => user.id === it.seller_id), orders : null, category : toCategory(it.category.name)
                }
            }
        )
    } 
    else //Es vendedor
    {
        ownProducts = products.filter(it => Number(it.owner_id) === ownUser.id);
        mainCategories = findMainCategories(ownProducts);
        ownDTO = ownProducts.map(it => 
            {
                return ( 
                    {
                        name : it.name, published : formatDate(it.published), stock : it.stock, price : formatPrice(it.price),
                        orders : orders.filter(order => order.product_id === it.id), seller : ownUser, category : toCategory(it.category.name)
                    }
                )
            }
        )
    }
    //Añadimos product, seller y client
    orders = orders.map(it => 
        {
            const product = products.find(pr => Number(pr.id) === Number(it.product_id));
            it.product = 
            { 
                name : product.name,
                id : product.id
            }
            it.seller = users.find(user => user.id === it.seller_id);
            it.client = users.find(user => user.id === it.client_id);
            return it;
        }
    );
    
    return <ProfileInfo role={ownUser.type} orders={orders} user={ownUser} categories={mainCategories} 
    products={userRole === ROLE_COMPRADOR ? suggestDTO : ownDTO}   />

}