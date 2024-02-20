import {PrismaClient } from "@prisma/client";
import ProductoMapper from "../mappers/ProductoMapper"

export default class ProductoService
{
    repo : PrismaClient

    constructor(prismaClient : PrismaClient)
    {
        this.repo = prismaClient;
    }

    async save(product : {
        ownerId : number,name : string, 
        description : string, category : string, state : string,
        colors : string[], price : number, stock : number, featuresText : string,featuresRows : string[],
        specialFeatures : string[] } )
    {
        return await this.repo.producto.create(
        {
            data:
            {
                owner:
                {
                    connectOrCreate:
                    {
                       where:{id: product.ownerId},
                       create:
                       {
                            id:product.ownerId
                       }
                    }
                },
                name: product.name,
                description: product.description,
                category:
                {
                    connectOrCreate:
                    {
                       where:{name: product.category},
                       create:
                       {
                            name:product.category
                       }
                    }
                },
                state: ProductoMapper.toState(product.state),
                colors: ProductoMapper.toColorArray(product.colors),
                price : product.price,
                stock : product.stock,
                features_text : product.featuresText,
                features_rows: product.featuresRows,
                features_special: product.specialFeatures,

            }
        }
        )
    }

    async find(productId : number)
    {
        return await this.repo.producto.findUnique(
            {
                where:{id : productId},
                include:
                {
                    category:{
                        select:{name:true}  //Devuelve solo el nombre
                    },
                    owner:true
                }
            })
    }

    async findAllFrom(ownerId : number)
    {
        return await this.repo.producto.findMany(
            {
                where:{
                    owner_id:ownerId
                },
                include:
                {
                    category:{
                        select:{name:true}  //Devuelve solo el nombre
                    },
                    owner:true
                }
            })
    }

    async update(product : {
        id : number,
        ownerId : number,name : string, 
        description : string, category : {name : string}, state : string,
        colors : string[], price : number, stock : number, featuresText : string,featuresRows : string[],
        specialFeatures : string[] })
    {
        return await this.repo.producto.update({
            where: { id : product.id},
            data:
            {
                name: product.name,
                description: product.description,
                category:
                {
                    connectOrCreate:
                    {
                       where:{name: product.category.name},
                       create:
                       {
                            name:product.category.name
                       }
                    }
                },
                state: ProductoMapper.toState(product.state),
                colors: ProductoMapper.toColorArray(product.colors),
                price : product.price,
                stock : product.stock,
                features_text : product.featuresText,
                features_rows: product.featuresRows,
                features_special: product.specialFeatures, 
            }
        })
    }

    
}