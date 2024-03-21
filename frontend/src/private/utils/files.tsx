import { open, unlink} from "fs/promises";

const fs = require("fs");

export async function saveImages(images : File[])
{
    let filenames : string[] = [];
    const promises = images.map(async img => 
    {
        const bufferArray = await img.arrayBuffer();
        const filepath = `${process.cwd()}/public/external/${img.name}`
        return open(filepath,'wx').then(res =>     //If path doesn't exist
        {
            res.writeFile(Buffer.from(bufferArray))
            .then(
                succ => {filenames = filenames.concat(`/external/${img.name}`); res.close();},          //Save filename of image
                err => {filenames = filenames.concat('image-broken.svg'); res.close();}  //Fallback if image was not saved
            )       
        },
        deny => {filenames = filenames.concat(`/external/${img.name}`)})    //If image was already stored
            
    })

    await Promise.all(promises);    //Wait for all images
    setTimeout(() => removeImages(filenames),60000);         //Purge images after 10 minute
    return filenames;
}

//Purge images fetched from external sources
export async function removeImages(filenames : string[])
{
    const promises = filenames.map(async file => 
        {
            const filepath = `${process.cwd()}/public/external/${file}`
            return unlink(filepath).catch(err => 
                console.log(`Image ${file} couldn't be removed from the public folder because: ${err} `));

        }
    )
    await Promise.all(promises);
}