import {Prisma, PrismaClient} from "@prisma/client";
import { findAllPedidoFromProduct, findAllPedidoFromSeller } from "./PedidoService";

const repo = new PrismaClient()

//No es necesario el async porque prisma.$transacion devuelve una promise
export async function saveOpinion(review : {orderId : string, rating : string, title : string, summary : string})
{
    let pedido = await repo.pedido.findUniqueOrThrow({where : {id : review.orderId}});

    return repo.opinion.create(
    {
        data : 
        {
            order:
            {
                connect:{id : review.orderId}
            },
            rating : parseFloat(review.rating),
            title : review.title,
            summary : review.summary
        }
    });
}

//Para buscar opinion de los clientes sobre un producto
export async function findOpinionByOrder(orderId : string)
{
    return repo.opinion.findUniqueOrThrow({where : {order_id : orderId}});
}

export async function findAllOpinionFromProduct(productId : number)
{
    let pedidos = await findAllPedidoFromProduct(productId);

    return pedidos.map(it => it.review);
}

export async function findAllOpinionFromSeller(sellerId : number)
{
    return repo.$transaction(async () => 
    {
        let pedidos = await findAllPedidoFromSeller(sellerId);

        return pedidos.map(it => it.review);
        
    })
}

export async function findAllOpinionFromClient(clientId : number)
{
    return repo.opinion.findMany(
        {
            where : {order : {client_id : clientId}}
        })
}