import { open, readFile, unlink} from "fs/promises";

export async function saveFiles(files : File[])
{
    let filenames : string[] = [];
    const promises = files.map(async file => 
    {
        const bufferArray = await file.arrayBuffer();
        const filepath = `${process.cwd()}/public/external/${file.name}`
        return open(filepath,'wx').then(res =>     //If path doesn't exist
        {
            return res.writeFile(Buffer.from(bufferArray))
            .then(
                succ => {filenames = filenames.concat(`external/${file.name}`); res.close();},          //Save filename of image
                err => {filenames = filenames.concat('image-broken.svg'); res.close();}  //Fallback if image was not saved
            )       
        },
        deny => {filenames = filenames.concat(`/external/${file.name}`)})    //If image was already stored
            
    })

    await Promise.all(promises);    //Wait for all images
    setTimeout(() => removeFiles(filenames),60000);         //Purge images after 10 minute
    return filenames;
}

//Purge images fetched from external sources
export async function removeFiles(filenames : string[])
{
    const promises = filenames.map(async file => 
        {
            const filepath = `${process.cwd()}/public/${file}`
            return unlink(filepath).catch(err => 
                console.log(`Unable to remove file at ${file} because: ${err} `));

        }
    )
    await Promise.all(promises);
}

//Paths are relative to the public folder. Must make it relative to cwd (root)
export async function readImages(paths : string[])
{
    const absPaths = paths.map(it => `${process.cwd()}/public/${it}` );
    let promises : Promise<File | null>[] = [];

    for(let i = 0; i < absPaths.length; i++)
    {
        const filename = absPaths[i].split('/').pop();
        const result = readFile(absPaths[i])
        .then
        (
            buff => new File([buff], filename ?? `image_${i}`),
            err => {console.log(err); return null}  
        )
        promises = promises.concat(result); 
    }
    return Promise.all(promises).then(files => files.filter(it => it != null));
}  