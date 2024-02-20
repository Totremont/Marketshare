import {PrismaClient, PedidoStatusHistory } from "@prisma/client";
import PedidoStatus from "../PedidoStatus";
import { toStatus } from "../mappers/StatusMapper";
import RequestStatus from "../mappers/RequestStatus";

const repo = new PrismaClient()

//No es necesario el async porque prisma.$transacion devuelve una promise
export function savePedido(order : {clientId : number, productId : number, 
    sellerId : number, amount : number, discount : number, status : string})
{
    //La operacion debe ser transacional para garantizar que todo se haga atómicamente (o no se haga nada)
    //Si la promesa falla, se revierte todo
    return repo.$transaction(async() => 
    {
        let productRequest = await requestProduct(order.productId);
        let clientRequest = await requestUser(order.clientId);

        let product = productRequest.status === 200 ? await productRequest.json() : null;
        let client = clientRequest.status === 200 ? await clientRequest.json() : null;

        if(product.hasOwnProperty("id") && client.hasOwnProperty("id"))
        {

            let currentStatus = order.status
            let totalPrice = product.price * order.amount * (100-order.discount)/100;    //Discount : [0-100%]
            
            if(product.stock < order.amount || !product.available ) //Hay stock suficiente?
                currentStatus = PedidoStatus.SIN_STOCK
            
            if(client.money < totalPrice )  //Tiene el cliente el dinero?
                currentStatus = PedidoStatus.RECHAZADO

            let statusObj : PedidoStatusHistory = {status : currentStatus, date : new Date()}

            let document = await repo.pedido.create(
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

            if(currentStatus === PedidoStatus.RECIBIDO) //Actualizar stocks y dinero
            {
                client.money -= totalPrice;
                product.stock -= order.amount;

                await updateProduct(product);
                await updateUser(client);

                let resultProduct = await updateProduct(product);
                let resultUser = await updateUser(client);

                console.log(`Producto: ${JSON.stringify(product)}`)

                if(resultProduct.status != RequestStatus.OK || resultUser.status != RequestStatus.OK)
                    throw new Error("Couldn't update user or product");

            }

            return document;
        } else throw new Error("Product or Client doesn't exist in external database");
    })
    
}

//Para actualizar su estado [RECIBIDO,EN_DISTRIBUCION,ENTREGADO] o CANCELAR
export function updatePedido(orderId : string, newStatus : string)
{
    return repo.$transaction(async() => 
    {
        let order = await repo.pedido.findUniqueOrThrow({where:{id : orderId}});
        //Si tira exception se burbujea hacia el controller

        let statusHistory = order.status_history;
        let currentStatus = toStatus(statusHistory[statusHistory.length - 1].status);

        if(currentStatus != PedidoStatus.RECHAZADO && currentStatus != PedidoStatus.CANCELADO)
        {
            statusHistory = statusHistory.concat({status : newStatus, date : new Date()});
            let updated = repo.pedido.update(
                {
                    where:{ id : orderId},
                    data:
                    {
                        status_history : statusHistory
                    }
                })

            if(newStatus === PedidoStatus.CANCELADO)    //Si se canceló el pedido se debe devolver el stock y el dinero
            {
                let productRequest = await requestProduct(order.product_id);
                let clientRequest = await requestUser(order.client_id);

                let product = productRequest.status === 200 ? await productRequest.json() : null;
                let client = clientRequest.status === 200 ? await clientRequest.json() : null;
                
                client.money += order.price;
                product.stock += order.amount;

                let resultProduct = await updateProduct(product);
                let resultUser = await updateUser(client);

                if(resultProduct.status != RequestStatus.OK || resultUser.status != RequestStatus.OK)
                    throw new Error("Couldn't update user or product");

            }

            return updated;
            
        } else throw new Error("Invalid status operation");
    })
}

export async function findAllPedidoFromClient(clientId : number)
{
    return repo.pedido.findMany({where:{client_id : clientId}, include : {review : true}});
}

export async function findAllPedidoFromSeller(sellerId : number)
{
    return repo.pedido.findMany({where : {seller_id : sellerId}, include : {review : true}});
}

export async function findAllPedidoFromProduct(productId : number)
{
    return repo.pedido.findMany({where : {product_id : productId}, include : {review : true}});
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

async function updateUser(user : any)
{
    return await fetch(`http://localhost:8080/internal/user`,
    { method : 'PUT',
    mode : 'cors',
    body : JSON.stringify(user),
    headers: {
        "Content-Type": "application/json",
      }
    }
    )
}

async function updateProduct(product : any)
{
    return await fetch(`http://localhost:8060/internal/product/update`,
    { method : 'PUT',
    mode : 'cors',
    body : JSON.stringify(product),
    headers: {
        "Content-Type": "application/json",
      }}
    )
}

