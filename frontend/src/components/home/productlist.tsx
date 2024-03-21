import formProductsToJson from "@/private/utils/formtojson";
import EmptyComponent from "./empty";

import {findAllProducts, findAllUsersByOppositeRole} from "@/private/actions/homedata";
import ProductCard from "./clients/productcard";
import { use} from "react";
import { saveImages } from "@/private/utils/files";

function sendImage(promise : Promise)
{
  return async function()
  {
    'use server'
    return promise;
  }
}

export default async function ProductList({token})
{
  const [users, formProducts] = await Promise.all([findAllUsersByOppositeRole('ROLE_COMPRADOR'),findAllProducts()]);

  const products = formProductsToJson(formProducts);
  
  if(products.length == 0) return <EmptyComponent missingElement={'productos'}/>

  const promises = products.map(async it => 
    {
      const images = await saveImages(it.images);
      const user = users.find(us => us.id === it.owner_id);
      return <ProductCard 
      id={it.id} imageFile={images[0]} published={it.published} 
      category={it.category.name} name={it.name} description={it.description} price={it.price}
      orgName={'IBM'} userCountry={'Argentina'}/>
    })
  return await Promise.all(promises);

}
