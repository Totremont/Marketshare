import { PrivatePage } from "@/components/private";
import CreateProduct from "@/components/product/create/view";
import { ACCESS_TOKEN, USERNAME_HEADER } from "@/middleware";
import { findUserByUsernameSSA } from "@/private/actions/home";
import { findProductByIdSSA } from "@/private/actions/product";
import { formToProduct } from "@/private/utils/mappers";
import { cookies, headers } from "next/headers";

export default async function ProductPage({ searchParams }) 
{   
    //Localhost/product/create?update=true&product_id=xxx
    const isUpdating = !!searchParams.update;
    const productId = searchParams.product_id;
    const token = cookies().get(ACCESS_TOKEN)?.value!;
    if(isUpdating && productId)
    {
        const username = headers().get(USERNAME_HEADER)!;
        const [user, formProduct] = await Promise.all([findUserByUsernameSSA(username), findProductByIdSSA(productId,false)]);
        const product : any = formToProduct(formProduct);
        if(Number(product[0].owner_id) != Number(user.id)) return <PrivatePage title="No puedes modificar un producto que no te pertenece"/>
    }
    
    return <CreateProduct isUpdating={isUpdating} productId={productId} token={token}/>

}
