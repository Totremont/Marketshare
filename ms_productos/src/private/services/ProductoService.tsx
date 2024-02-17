import { Estado,Colores, PrismaClient } from "@prisma/client";

class ProductoService
{
    repo : PrismaClient

    constructor(prismaClient : PrismaClient)
    {
        this.repo = prismaClient;
    }

    async save(product : {
        ownerId : number,name : string, 
        description : string, category : string, state : Estado,
        colors : Colores[], price : number, stock : number, featuresText : string,featuresRows : string[],
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
                state: product.state,
                colors: product.colors,
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

    
}