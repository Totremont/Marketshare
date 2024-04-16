import { ROLE_COMPRADOR, ROLE_VENDEDOR, USERNAME_HEADER, USER_ROLE_HEADER } from "@/middleware";
import { findAllOrdersByRoleSSA, findAllProductsSSA, findAllUsersByRoleSSA, findUserByUsernameSSA } from "@/private/actions/home";
import { formToProduct, formatDate, formatPrice, getOrderStatus } from "@/private/utils/mappers";
import { headers } from "next/headers";
import OrderCard from "./clientside/ordercard";
import { saveFiles } from "@/private/utils/files";

export default async function OrderList()
{
    const username = headers().get(USERNAME_HEADER)!;
    const ownRole = headers().get(USER_ROLE_HEADER)!;
    const ownUser : any = await findUserByUsernameSSA(username);
    const promise = ownRole === ROLE_COMPRADOR ? findAllUsersByRoleSSA(ROLE_VENDEDOR) : findAllUsersByRoleSSA(ROLE_COMPRADOR);
    const [orders, formProducts, users] : [any[],FormData, any[]] = await Promise.all(
        [findAllOrdersByRoleSSA(ownUser.type, ownUser.id), findAllProductsSSA(),promise]
    );
    const products = formToProduct(formProducts);
    const promises = orders.map(async it => 
        {
            const product = products.find(product => Number(product.id) === it.product_id);
            const user = users.find(user => ownRole == ROLE_COMPRADOR ? user.id === it.seller_id : user.id === it.client_id)
            const status = getOrderStatus(it);
            const images = await saveFiles(product.images);
            return <OrderCard id={it.id} productName={product.name} 
            image={images[0]} ownRole={ownRole} orgName={user.organization.name} 
            price={formatPrice(Number(it.price))} units={it.amount} status={status.status} date={formatDate(status.date,true)} />
        })
    return Promise.all(promises);
}