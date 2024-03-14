import {PrismaClient } from "@prisma/client";
import ProductoMapper from "../mappers/ProductoMapper"
import RequestStatus from "../mappers/RequestStatus";
import { unlink, writeFile } from "fs/promises";
import { readFile } from "fs/promises";
import { NotFoundError } from "../exceptions";

export default class ProductoService
{
    repo : PrismaClient

    constructor(prismaClient : PrismaClient)
    {
        this.repo = prismaClient;
    }

    async save(authToken : string, product : {
        ownerId : number,name : string, 
        description : string, category : {name : string}, state : string, images : File[],
        colors : string[], price : number, stock : number, featuresText : string,featuresRows : string[],
        specialFeatures : string[] }, returnImages : Boolean )
    {
        return this.repo.$transaction(async () => 
        {
            let clientRequest = await requestUser(product.ownerId, authToken);
            if(!clientRequest.ok) throw new Error('No user found with the provided id');
            //let client = clientRequest.status === RequestStatus.OK ? await clientRequest.json() : null;
            //if(client.hasOwnProperty("type") && client.type === "ROLE_VENDEDOR")
            let newProduct = await this.repo.producto.create(
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
                        where:{name: product.category.name},
                        create:
                        {
                            name:product.category.name
                        }
                        }
                    },
                    state: ProductoMapper.toState(product.state),
                    colors: product.colors,
                    price : product.price,
                    stock : product.stock,
                    features_text : product.featuresText,
                    features_rows: product.featuresRows,
                    features_special: product.specialFeatures,

                },
                include:
                {
                    category:{
                        select:{name:true}  //Devuelve solo el nombre
                    }
                }
            }
            );
            //Añadir imagenes | Paths de su ubicación en el filesystem
            console.log("Añadiendo imágenes");
            const paths = await saveImages(newProduct.id,product.images);

            if(paths.length > 0) newProduct = this.repo.producto.update(
                {
                    where : {id : newProduct.id},
                    data : 
                    {
                        images : paths
                    },
                    include:
                    {
                        category:{
                            select:{name:true}  //Devuelve solo el nombre
                        }
                    }
                })
            
            //Esconder paths del filesystem y solo devolver los blobs
            newProduct.images = [];
            if(returnImages) newProduct.blobImages = product.images;
            return newProduct;    
            //else throw Error("An user of type 'COMPRADOR' can't create a product");
        })
    }

    async find(productId : number, returnImages : boolean)
    {
        const entity = await this.repo.producto.findUnique(
            {
                where:{id : productId},
                include:
                {
                    category:{
                        select:{name:true}  //Devuelve solo el nombre
                    },
                    owner:true
                }
            }
        )
        if(!entity) throw new NotFoundError;
        if(returnImages)
        {
            let images : File[] = [];
            try
            {
                images = await readImages(entity.images);

            } catch(e){};
            entity.blobImages = images;
        }
        entity.images = [];
        return entity;      
    }


    async findAllFrom(ownerId : number, returnImages : boolean)
    {
        const entities = await this.repo.producto.findMany(
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
            }
        )
        if(entities.length == 0) throw new NotFoundError();
        const promises = entities.map(async (it) => 
        {
            if(returnImages)
            {
                let blobs : File[] = [];
                try
                {
                    blobs = await readImages(it.images);

                } catch(e){}
                it.blobImages = blobs;
            } 
            it.images = [];
            return it;
        })

        const products = await Promise.all(promises);
        return products;
    }

    async findAll(returnImages : boolean)
    {
        const entities = await this.repo.producto.findMany(
        {
            orderBy:
            {
                published: 'desc'
            },
            include:
            {
                category:{
                    select:{name:true}  //Devuelve solo el nombre
                },
                owner:true
            }
        })

        if(entities.length == 0) throw new NotFoundError();
        const promises = entities.map(async (it) => 
        {
            if(returnImages)
            {
                let blobs : File[] = [];
                try
                {
                    blobs = await readImages(it.images);

                } catch(e){}
                it.blobImages = blobs;
            } 
            it.images = [];
            return it;
        })

        const products = await Promise.all(promises);
        return products;
    }

    async update(product : {
        id : number,
        ownerId : number,name : string, 
        description : string, category : {name : string}, state : string, images : File[],
        colors : string[], price : number, stock : number, featuresText : string,featuresRows : string[],
        specialFeatures : string[] }, returnImages : boolean)
    {
        const currentPaths = await this.repo.producto.findUnique(
            {
                where:{id : product.id},
                select:
                {
                    images : true
                }
            }
        )
        if(!currentPaths) throw new NotFoundError();

        const newPaths = await updateImages(currentPaths.images,product.images,product.id);

        const entity = this.repo.producto.update({
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
                images : newPaths,
                colors: product.colors,
                price : product.price,
                stock : product.stock,
                features_text : product.featuresText,
                features_rows: product.featuresRows,
                features_special: product.specialFeatures, 
            },
            include:
            {
                category:{
                    select:{name:true}  //Devuelve solo el nombre
                }
            }
        })

        entity.images = [];
        if(returnImages) entity.blobImages = product.images;
        return entity;
    }

    
}

async function requestUser(userId : number, authToken : string)
{
    let result = await fetch(`${process.env.ms_usuarios_host}/api/users/${userId}`,
    {   
        method : 'GET',
        headers:
        {
            "Authorization":    `${authToken}`
        },
        mode : 'cors'
    }
    )

    return result
}

async function saveImages(productId : number, images : File[])
{
    let storePaths : string[] = [];
    const bufferArrays = images.map((it) => it.arrayBuffer());
    //cwd + /public/images/pr_{id_product}_img_{index}.png
    const filenames = (index : number, image : File) => 
    {
        const [type,extension] = image.type.split('/');
        console.log("Extensión: " + extension);
        let path;
        if(extension === 'png' || extension === 'gif' || extension === 'jpeg' || extension === 'webp')
            path = `${process.cwd()}/public/images/pr_${productId}_image_${index}.${extension}`;
        else path = `${process.cwd()}/public/images/pr_${productId}_image_${index}`;
        return path;
    }

    let promises : Promise<string>[] = [];

    for(let i = 0; i < bufferArrays.length; i++)
    {
        const promise = new Promise<string>(async (resolve,reject) => 
        {
            try
            {
                const path = filenames(i, images[i]);
                const img = await bufferArrays[i];
                await writeFile(path, Buffer.from(img)); 
                resolve(path);
            } catch(e){console.log(e); resolve('');}
        })
        promises = promises.concat(promise);
    }

    await Promise.all(promises).then(
        values => values.forEach(it => {if(it) storePaths = storePaths.concat(it)})
    )

    return storePaths;

}

async function readImages(paths : string[])
{
    let files : File[] = [];

    let promises : Promise<File | null>[] = [];

    for(let i = 0; i < paths.length; i++)
    {
        const promise = new Promise<File | null>(async (resolve,reject) => 
        {
            try
            {
                const filename = paths[i].split('/').pop();
                console.log("Filename: " + filename);
                const buffer = await readFile(paths[i]);
                resolve(new File([buffer], filename ? filename : `image_${i}`));
            } catch(e){resolve(null);}
        })
        promises = promises.concat(promise);
        
    }
    await Promise.all(promises).then(
        (values) => values.forEach(it => { if(it) files = files.concat(it) })
    )

    return files;
}  

async function updateImages(currentPaths : string[], newImages : File[], productId : number)   //Reescribir y borrar
{   
    //Rewritting old files
    let storedPaths = await saveImages(productId,newImages);
    const diff = currentPaths.length - storedPaths.length;
    if(diff > 0)    //Delete remaining files
    {
        const start = currentPaths.length;
        let promises : Promise<null>[] = [];

        for(let i = 0; i < diff; i++)
        {
            const promise = new Promise<null>(async (res,rej) => 
            {
                try
                {
                    await unlink(currentPaths[start + i]);
                    res(null);
                } catch(e){storedPaths = storedPaths.concat(currentPaths[start + i]); res(null);}    
                //If could not be deleted, add to current path
            })
            promises = promises.concat(promise);
        }

        await Promise.all(promises);
    }
    return storedPaths;  
}