import ProductInfo from "@/components/product/page/info";
import { USERNAME_HEADER } from "@/middleware";
import { findUserByUsernameSSA } from "@/private/actions/home";
import { findOrdersFromSellerSSA} from "@/private/actions/order";
import { findProductByIdSSA } from "@/private/actions/product";
import { findUserByIdSSA } from "@/private/actions/user";
import { saveFiles } from "@/private/utils/files";
import { formToProduct, formatDate, formatPrice, getOrderStatus, toCategory } from "@/private/utils/mappers";
import { OrderStatus } from "@/private/utils/properties";
import { Metadata } from "next";
import { headers } from "next/headers";

export const metadata: Metadata = {
    title: 'Información de producto',
  };
  
export default async function ProductPage({ params }: { params: { id: string } })
{
    let product : any;
    let username = headers().get(USERNAME_HEADER);
    const user = await findUserByUsernameSSA(username!);
    const externalData = findProductByIdSSA(params.id)
    .then((res) => 
    {
        product = formToProduct(res)[0];    //Should be one or cancel the promise if empty
        const sellerId = product.owner_id;
        return Promise.all([findOrdersFromSellerSSA(sellerId),findUserByIdSSA(sellerId)]);
    },
    (err) => {throw err});

    const [orders,seller] : any[][] = await externalData;
    const images = await saveFiles(product.images);

    const category = toCategory(product.category.name);
    const sellerRegisterDate = formatDate(seller.registerDate);
    const isMyProduct = Number(product.owner_id) === user.id

    //Ordenes completadas
    const completedOrders = orders.filter(it => getOrderStatus(it).status === OrderStatus.ENTREGADO);
    const reviews = completedOrders.filter(it => it.review).map(it => it.review);
    const productOrders = completedOrders.filter(it => Number(it.product_id) === Number(product.id));
    const productReviews = productOrders.filter(it => it.review).map(it => 
    {
        const review = it.review;
        review.client_id = it.client_id;
        review.date = it.status_history[it.status_history.length - 1].date;
        return review;
    });

    const productPrice = formatPrice(product.price);
    const hasDiscount = Math.random() * 10 < 5;     //50% chances
    const published = formatDate(product.published);
    let discount = 0;
    let discountValue = product.price;
    let discountPrice = productPrice;

    if(hasDiscount)
    {
        discount = Math.round(Math.random() * 70)   //Up to 70% discount
        discountValue =  Math.round(product.price * (100-discount) / 100);
        discountPrice = formatPrice(discountValue);
    }

    const price = {
        full : {text: productPrice, value: product.price }, 
    discount : {text : discountPrice, value: discountValue }}

    return <ProductInfo isMyProduct={isMyProduct} role={user.type} id={product.id} name={product.name} sellerRegisterDate={sellerRegisterDate} category={category!} images={images}
    brief={product.description} colors={product.colors} productState={product.state}
    published={published} description={product.featuresText} features={product.featuresRows} 
    specialFeatures={product.specialFeatures} stock={product.stock} 
    productOrders={productOrders} productReviews={productReviews} 
    seller={seller} sellerOrders={completedOrders} sellerReviews={reviews} price={price} discount={discount}
    client={user} />
}