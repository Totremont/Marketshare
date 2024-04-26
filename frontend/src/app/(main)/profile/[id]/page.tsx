import { findMainCategories } from "@/components/home/userlist";
import { LockIcon } from "@/components/icons/miscellaneous";
import { PrivatePage } from "@/components/private";
import ProductInfo from "@/components/product/page/info";
import ProfileInfo from "@/components/profile/info";
import { ROLE_COMPRADOR, ROLE_VENDEDOR, USERNAME_HEADER, USER_ROLE_HEADER } from "@/middleware";
import { findAllOrdersByRoleSSA, findAllProductsSSA, findAllUsersByRoleSSA, findUserByUsernameSSA } from "@/private/actions/home";
import { formToProduct, formatDate, formatPrice, toCategory } from "@/private/utils/mappers";
import { Metadata } from "next";
import { headers } from "next/headers";

export const metadata: Metadata = {
    title: 'Perfil',
  };

export default async function ProfilePage({ params }: { params: { id: string } })
{
    const username = headers().get(USERNAME_HEADER)!;
    const userRole = headers().get(USER_ROLE_HEADER)!;
    const ownUser = await findUserByUsernameSSA(username);

    if(ownUser.id != params.id) return <PrivatePage title="No puedes ver el perfil de otro usuario"/>

    let [orders,formProducts, sellers, clients] : [any[], FormData, any[], any[]] = await 
    Promise.all
    (
        [findAllOrdersByRoleSSA(userRole,ownUser.id),findAllProductsSSA(false), findAllUsersByRoleSSA(ROLE_VENDEDOR),
        findAllUsersByRoleSSA(ROLE_COMPRADOR)]
    );  

    const users = sellers.concat(clients);
    const products = formToProduct(formProducts);
    let mainCategories : {category : string, ocurrency : number}[] = [];

    if(userRole === ROLE_COMPRADOR)
    {
        let suggestProducts : any[] = [];
        let suggestDTO : any[] = [];
        let productsBought : any = [];

        const ordersWithProducts = orders.map(it => 
            {
                const product = products.find(pr => Number(pr.id) === it.product_id);
                const seller = users.find(user => Number(user.id) === Number(it.seller_id));
                productsBought = productsBought.concat(product);
                return {product : {id : product.id, name : product.name}, order : it, seller : seller, client : null}
            }
        );

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
                    id : it.id, 
                    name : it.name, 
                    published : formatDate(it.published), 
                    stock : it.stock,
                    price : formatPrice(it.price),
                    orders : [],
                    seller : sellers.find(user => Number(user.id) === Number(it.owner_id)), 
                    category : toCategory(it.category.name)
                }
            }
        )

        return <ProfileInfo role={ownUser.type} ordersWithData={ordersWithProducts} user={ownUser} 
        categories={mainCategories} roleProducts={suggestDTO}   />
    } 
    else //Es vendedor
    {
        let ownProducts : any[] = [];   //Productos de vendedor
        let ownDTO : any[] = [];
        ownProducts = products.filter(it => Number(it.owner_id) === Number(ownUser.id));
        mainCategories = findMainCategories(ownProducts);

        const ordersWithProducts = orders.map(it => 
            {
                const product = ownProducts.find(pr => Number(pr.id) === it.product_id);
                const client = users.find(user => Number(user.id) === Number(it.client_id));
                return {product : {id : product.id, name : product.name}, order : it, seller : null, client : client}
            }
        );

        ownDTO = ownProducts.map(it => 
            {
                return  {
                        id : it.id,
                        name : it.name, 
                        published : formatDate(it.published), 
                        stock : it.stock, 
                        price : formatPrice(it.price), 
                        orders : orders.filter(order => Number(order.product_id) === Number(it.id)), 
                        category : toCategory(it.category.name),
                        seller : null
                }
                
            }
        )
        
        return <ProfileInfo role={ownUser.type} ordersWithData={ordersWithProducts} user={ownUser} 
        categories={mainCategories} roleProducts={ownDTO}   />
    }

}