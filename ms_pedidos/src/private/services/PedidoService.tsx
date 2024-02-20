import {PrismaClient, PedidoStatusHistory } from "@prisma/client";
import PedidoStatus from "../PedidoStatus";
import { toStatus } from "../mappers/StatusMapper";

const repo = new PrismaClient()

export async function save(order : {clientId : number, productId : number, 
    sellerId : number, amount : number, discount : number, status : string})
{
    let productRequest = await requestProduct(order.productId);
    let clientRequest = await requestUser(order.clientId);

    let product = productRequest.status === 200 ? await productRequest.json() : null;
    let client = clientRequest.status === 200 ? await clientRequest.json() : null;

    if(product.hasOwnProperty("id") && client.hasOwnProperty("id"))
    {

    let currentStatus = order.status
    let totalPrice = product.price * order.amount * (100-order.discount)/100;    //Discount : [0-100%]
    
    if(product.stock < order.amount ) //Hay stock suficiente?
        currentStatus = PedidoStatus.SIN_STOCK
    
    if(client.money < totalPrice )  //Tiene el cliente el dinero?
        currentStatus = PedidoStatus.RECHAZADO

    let statusObj : PedidoStatusHistory = {status : currentStatus, date : new Date()}

    return repo.pedido.create(
        {
            data:
            {
                client_id : order.clientId,
                product_id : order.productId,
                seller_id : order.sellerId,
                amount : order.amount,
                discount : order.discount,
                price : totalPrice,
                status_history : [statusObj]
            }
        })
    } else throw new Error("Product or Client doesn't exist in external database");
}

//Para actualizar su estado [RECIBIDO,EN_DISTRIBUCION,ENTREGADO] o CANCELAR
export async function update(productId : string, newStatus : string)
{
    let product = await repo.pedido.findUniqueOrThrow({where:{id : productId}});
    //Si tira exception se burbujea hacia el controller

    let statusHistory = product.status_history;
    let currentStatus = toStatus(statusHistory[statusHistory.length - 1].status);

    if(currentStatus != PedidoStatus.RECHAZADO && currentStatus != PedidoStatus.CANCELADO)
    {
        statusHistory = statusHistory.concat({status : newStatus, date : new Date()});
        return repo.pedido.update(
            {
                where:{ id : productId},
                data:
                {
                    status_history : statusHistory
                }
            })
    } else throw new Error("Invalid status operation");
}

export async function findAllFromClient(clientId : number)
{
    return repo.pedido.findMany({where:{client_id : clientId}});
}

export async function findAllFromSeller(sellerId : number)
{
    return repo.pedido.findMany({where : {seller_id : sellerId}});
}

//Obtener un usuario por su id
async function requestUser(userId : number)
{
    let result = await fetch(`http://localhost:8080/internal/user/${userId}`,
    { method : 'GET',
    mode : 'cors'}
    )

    return result
}

//Obtener un producto por su id
async function requestProduct(productId : number)
{
    let result = await fetch(`http://localhost:8060/internal/product/${productId}`,
    { method : 'GET',
    mode : 'cors'}
    )

    return result
}

