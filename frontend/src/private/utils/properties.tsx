
export class SpecialFeature
{
    static ENVIO_GRATIS = 0;
    static AHORA_12 = 1;
    static GARANTIA = 2;
    static SUSTENTABLE = 3;
}

export class OrderStatus
{
    static CONFIRMED = 0;
    static ON_DELIVERY = 1;
    static CANCELLED = 2;
    static DELIVERED = 3;
}

export class ViewVisibility
{
    static VISIBLE = "visible";
    static INVISIBLE = "invisible";
    static HIDDEN = "hidden";
}

export class BackgroundColors
{
    static GREEN = "bg-[#0f766e]";
    static SIENNA_BROWN = "bg-[#A0522D]";
    static PURPLE = "bg-[#7B68EE]";
    static GRAY = "bg-[#696969]";
    static OLIVE = "bg-[#556B2F]"

    //Product colors
    static RED = "bg-[#A52A2A]"
    static BLUE = "bg-[#6495ED]"
    static YELLOW = "bg-[#DAA520]"
    static WHITE = "bg-[#DCDCDC]"
    static BLACK = "bg-[#000000]"
}

export class UserTypes
{
    static COMPRADOR = 'ROLE_COMPRADOR';
    static VENDEDOR = 'ROLE_VENDEDOR';
}

export class Categories
{
    static ELECTRONICA = 'Electrónica';
    static AUDIO = 'Audio';
    static INFORMATICA = 'Informática';
    static PEQUENIOS_DISPOSITIVOS = 'Pequeños dispositivos';
    static HERRAMIENTAS = 'Herramientas';
    static BELLEZA = 'Belleza';
    static DEPORTE_BIENESTAR = 'Deporte y bienestar';
    static PRENDAS_MODA = 'Prendas y moda';
    static VEHICULOS = 'Vehículos';
    static INDUSTRIAS = 'Industrias';
    static CONSTRUCCION = 'Construcción';
    static OFICINAS = 'Oficinas';
    static OTRAS = 'Otras';
}