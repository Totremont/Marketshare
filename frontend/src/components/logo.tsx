
export default function Logo(props: {style : string, inverted : boolean})
{
    return(props.inverted ? 
    <img src={`/marketshare-white.svg`} className={`w-44 ${props.style}`} /> :
    <img src={`/marketshare.svg`} className={`w-44 ${props.style}`} />)
}