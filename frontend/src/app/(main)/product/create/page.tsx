import { PrivatePage } from "@/components/private";
import CreateProduct from "@/components/product/create/view";
import { ACCESS_TOKEN, USERNAME_HEADER } from "@/middleware";
import { findUserByUsernameSSA } from "@/private/actions/home";
import { findProductByIdSSA } from "@/private/actions/product";
import { saveFiles } from "@/private/utils/files";
import { formToProduct } from "@/private/utils/mappers";
import { Metadata } from "next";
import { cookies, headers } from "next/headers";

export const metadata: Metadata = {
    title: 'Crear producto',
};

export default async function ProductPage({ searchParams }) 
{   
    //Localhost/product/create?update=true&product_id=xxx
    const isUpdating = !!searchParams.update;
    const productId = searchParams.product_id;

    const token = cookies().get(ACCESS_TOKEN)?.value!;
    const username = headers().get(USERNAME_HEADER)!;
    const user = await findUserByUsernameSSA(username);
    let product : any;

    if(isUpdating && productId)
    {
        const productResponse = await findProductByIdSSA(productId);
        if(productResponse.success)
        {
            product = formToProduct(productResponse.form!)[0];
            if(Number(product.owner_id) != Number(user.id)) 
                return <PrivatePage title="No puedes modificar un producto que no te pertenece"/>
            const paths = await saveFiles(product.images as File[]);
            product.images = paths;
        }
        else throw new Error("Couldn't find product to modify");
    }
    
    return <CreateProduct isUpdating={isUpdating} modifyProduct={product} token={token} userId={user.id}/>

}
