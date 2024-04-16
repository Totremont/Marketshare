import {PrismaClient, PedidoStatusHistory, Pedido } from "@prisma/client";
import PedidoStatus from "../PedidoStatus";
import { rejectedStatus, toStatus } from "../mappers/StatusMapper";

const repo = new PrismaClient()

const MAX_TIME_TO_PROGRESS = (600*1000)  //600 Seg | 10 min

const randomTime = () => Math.random() * MAX_TIME_TO_PROGRESS;

export async function savePedido(authToken : string, order : {clientId : number, productId : number, 
    sellerId : number, amount : number, discount : number, finalPrice : number, product_extras : string})
{
    const [productForm,client] = await Promise.all(
    [
        requestProduct(order.productId,authToken).then(res => res.formData()),
        requestUser(order.clientId,authToken).then(res => res.json())
    ]);
    //La operacion debe ser transacional para garantizar que todo se haga atómicamente (o no se haga nada)
    const operation = repo.$transaction(async (prisma) => 
    {
        const productId = Number(productForm.getAll('id')[0]);
        let productStock = Number(productForm.getAll('stock')[0]);

        let currentStatus : string = PedidoStatus.RECIBIDO;
        //Final price should be sent by the frontend
        //let totalPrice = product.price * order.amount * (100-order.discount)/100;    //Discount : [0-100%]
        
        if(productStock < order.amount) //Hay stock suficiente?
            currentStatus = PedidoStatus.SIN_STOCK
        
        if(client.money < order.finalPrice )  //Tiene el cliente el dinero?
            currentStatus = PedidoStatus.RECHAZADO

        let statusObj : PedidoStatusHistory = {status : currentStatus, date : new Date()}

        let document = await prisma.pedido.create(
        {
            data:
            {
                client_id : Number(order.clientId),
                product_id : Number(order.productId),
                seller_id : Number(order.sellerId),
                amount : Number(order.amount),
                discount : Number(order.discount),
                price : Number(order.finalPrice),
                status_history : [statusObj],
                product_extras : order.product_extras
            }
        })
        
        if(currentStatus === PedidoStatus.RECIBIDO) //Actualizar stocks y dinero
        {
            client.money -= document.price;
            productStock -= document.amount;
            await Promise.all(
            [
                updateProduct(productStock,productId,authToken)
                .then(
                    res => {if(!res.ok) throw new Error('Updating product failed')},
                    err => {throw err}
                ),
                updateUser(client,authToken).then(
                    res => {if(!res.ok) throw new Error('Updating user failed')},
                    err => {throw err}
                )
            ])
        }
        return document;
    })
    .then
    (      //If order could be created, artificially progress the order
        res => 
        {
            setTimeout(() => 
            {
                progressPedido(res.id,PedidoStatus.EN_DISTRIBUCION);
                setTimeout(() => progressPedido(res.id,PedidoStatus.ENTREGADO),randomTime())
            },randomTime()); 

            return res;
        }
    )

    return operation;
    
}

//Para CANCELAR
//Solo se puede actualizar una orden válida
export async function cancelPedido(authToken : string, orderId : string)
{
    let order : Pedido;
    const [productForm, client] = await repo.pedido.findUniqueOrThrow({where:{id : orderId}})
    .then(
        res =>  
        {
            order = res;
            return Promise.all(
            [
                requestProduct(res.product_id,authToken).then(res => res.formData()),
                requestUser(res.client_id,authToken).then(res => res.json())
            ]);
        }
    );
    return repo.$transaction(async (prisma) => 
    {
        let statusHistory = order.status_history;
        let currentStatus = toStatus(statusHistory[statusHistory.length - 1].status);

        if(rejectedStatus.includes(currentStatus)) throw new Error("The order was already cancel");
        
        statusHistory = statusHistory.concat({status : PedidoStatus.CANCELADO, date : new Date()});
        const updated = await prisma.pedido.update(
            {
                where:{ id : orderId},
                data:
                {
                    status_history : statusHistory
                }
            }
        )

        const productId = Number(productForm.getAll('id')[0]);
        let productStock = Number(productForm.getAll('stock')[0]);
        
        client.money += order.price;
        productStock += order.amount;

        await Promise.all(
            [
                updateProduct(productStock,productId,authToken)
                .then(
                    res => {if(!res.ok) throw new Error('Updating product failed')},
                    err => {throw err}
                ),
                updateUser(client,authToken).then(
                    res => {if(!res.ok) throw new Error('Updating user failed')},
                    err => {throw err}
                )
            ]
        )
        return updated;
    });
}
//Avanzar el pedido de RECIBIDO a EN DISTRIBUCION y ENTREGADO
async function progressPedido(orderId : string, newStatus : string)
{
    const order = await repo.pedido.findUniqueOrThrow({where:{id : orderId}});

    let statusHistory = order.status_history;
    let currentStatus = toStatus(statusHistory[statusHistory.length - 1].status);

    if(currentStatus != PedidoStatus.CANCELADO)
    {
        statusHistory = statusHistory.concat({status : newStatus, date : new Date()});
        await repo.pedido.update(
        {
            where:{ id : orderId},
            data:
            {
                status_history : statusHistory
            }
        })
        
    } else console.log("Tried to progress a cancel order");
}

export async function findAllPedido()
{
    return repo.pedido.findMany({include : {review : true}, orderBy : {created : 'desc'}});
}

export async function findAllPedidoFromClient(clientId : number)
{
    return repo.pedido.findMany({where:{client_id : clientId}, include : {review : true}, orderBy : {created : 'desc'}});
}

export async function findAllPedidoFromClientAndProduct(clientId : number, productId : number)
{
    return repo.pedido.findMany({where:{client_id : clientId, product_id : productId}, include : {review : true}, orderBy : {created : 'desc'}});
}

export async function findAllPedidoFromSeller(sellerId : number)
{
    return repo.pedido.findMany({where : {seller_id : sellerId}, include : {review : true}, orderBy : {created : 'desc'}});
}

export async function findAllPedidoFromProduct(productId : number)
{
    return repo.pedido.findMany({where : {product_id : productId}, include : {review : true}, orderBy : {created : 'desc'}});
}

//Obtener un usuario por su id
async function requestUser(userId : number, authToken : string)
{
    return fetch(`${process.env.ms_usuarios_host}/api/users/${userId}`,
    {   
        method : 'GET',
        headers:
        {
            "Authorization":    `${authToken}`
        },
        mode : 'cors'
    }
    );
}

//Obtener un producto por su id
async function requestProduct(productId : number, authToken : string)
{
    return fetch(`${process.env.ms_productos_host}/api/products/${productId}?send_images=false`,
    {   
        method : 'GET',
        headers:
        {
            "Authorization":    `${authToken}`
        },
        mode : 'cors'
    }
    );
}

async function updateUser(user : any, authToken : string)
{
    return fetch(`${process.env.ms_usuarios_host}/api/users`,
        {   
            method : 'PUT',
            mode : 'cors',
            body : JSON.stringify(user),
            headers: 
            {
                "Authorization":    `${authToken}`,
                "Content-Type":     "application/json",
            }
        }
    );
}

async function updateProduct(stock : number, id: number, authToken : string)
{
    return fetch(`${process.env.ms_productos_host}/api/products/update?stock=${stock}&id=${id}`,
        { 
            method : 'PUT',
            mode : 'cors',
            headers: 
            {
                "Authorization":    `${authToken}`,
                "Content-Type":     "application/json",
            }
        }
    )
}

