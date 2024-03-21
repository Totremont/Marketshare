
export default class SpecialFeature
{
    static ENVIO_GRATIS = 0;
    static AHORA_12 = 1;
    static GARANTIA = 2;
    static SUSTENTABLE = 3;
}

export function toSpecialFeature(feature : string)
{
    switch(feature)
    {
        case 'envio_gratis':
            return SpecialFeature.ENVIO_GRATIS;
        case 'ahora_12':
            return SpecialFeature.AHORA_12;
        case 'garantia':
            return SpecialFeature.GARANTIA;
        case 'sustentable':
            return SpecialFeature.SUSTENTABLE;
        default:
            return -1;
    }
}