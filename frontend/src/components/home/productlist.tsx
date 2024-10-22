import EmptyComponent from "./empty";

import {findAllProductsSSA, findAllUsersByRoleSSA} from "@/private/actions/home";
import ProductCard from "./clientside/productcard";
import { saveFiles } from "@/private/utils/files";
import { formToProduct, formatDate, formatPrice, toCategory, toSpecialFeature } from "@/private/utils/mappers";
import { UserTypes } from "@/private/utils/properties";

export default async function ProductList()
{

  //Promises
  const productsFetch = findAllProductsSSA();
  const usersFetch = findAllUsersByRoleSSA(UserTypes.VENDEDOR);

  const [users, formProducts] = await Promise.all([usersFetch,productsFetch]);

  if(!formProducts) return <EmptyComponent missingElement='productos'/>

  const products = formToProduct(formProducts);
  
  //if(products.length == 0) return <EmptyComponent missingElement={'productos'}/>
  const promises = products.map(async it => 
    {
      const images = await saveFiles(it.images);
      const user = users.find(us => us.id == it.owner_id);
      const feature = it.specialFeatures.length ? toSpecialFeature(it.specialFeatures[0]) : -1;
      const price = formatPrice(it.price);
      return <ProductCard
      id={it.id} imageFile={images[0]} published={formatDate(it.published)} 
      category={toCategory(it.category.name)} name={it.name} description={it.description} price={price}
      withUser={!!user} orgName={user?.organization.name} feature={feature}/>
    })
  return Promise.all(promises);

}
