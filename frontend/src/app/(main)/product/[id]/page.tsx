import ProductInfo from "@/components/product/page/page";
import { findOrdersFromSeller, findReviewsFromSeller } from "@/private/actions/order";
import { findProductById } from "@/private/actions/product";
import { findUserById } from "@/private/actions/user";
import { saveFiles } from "@/private/utils/files";
import { formToProduct, formatDate, formatPrice, getAverageRating, toCategory } from "@/private/utils/mappers";


export default async function ProductPage({ params }: { params: { id: string } })
{
    let product : any;
    let seller : any;
    let orders : any;
    let reviews : any;

    const data = findProductById(params.id)
    .then((res) => 
    {
        product = formToProduct(res)[0];
        const seller : string = product.owner_id;
        return Promise.all([findOrdersFromSeller(seller,false),findReviewsFromSeller(seller),findUserById(seller)]);
    },
    (err) => {throw err});

    [orders,reviews,seller] = await data;

    const images = await saveFiles(product.images);

    const category = toCategory(product.category.name);

    const productOrders : any[] = orders.filter(it => it.product_id === product.id);
    const productOrdersIds = productOrders.map(it => it.id);
    const productReviews = reviews.filter(it => productOrdersIds.find(id => id === it.order_id));

    const productPrice = formatPrice(product.price);
    const hasDiscount = Math.random() * 10 < 5;     //50% chances
    const published = formatDate(product.published);
    let discount = 0;
    let discountPrice = productPrice;

    if(hasDiscount)
    {
        discount = Math.round(Math.random() * 70)   //Up to 70% discount
        discountPrice = formatPrice(product.price * (100-discount) / 100);
    }

    const price = {full : productPrice, discount : discountPrice}

    return <ProductInfo category={category!} images={images}
    brief={product.description} colors={product.colors} productState={product.state}
    published={published} description={product.featuresText} features={product.featuresRows} 
    specialFeatures={product.specialFeatures} stock={product.stock} 
    productOrders={productOrders} productReviews={productReviews} 
    seller={seller} sellerOrders={orders} sellerReviews={reviews} price={price} discount={discount} />
}