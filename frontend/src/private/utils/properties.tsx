export class SpecialFeature
{
    static ENVIO_GRATIS = 0;
    static AHORA_12 = 1;
    static GARANTIA = 2;
    static SUSTENTABLE = 3;
}

export class OrderStatus
{
    static RECIBIDO = 'Recibido';
    static EN_DISTRIBUCION = 'En distribución';
    static ENTREGADO = 'Entregado';
    static CANCELADO = 'Cancelado';
    static RECHAZADO = 'Rechazado';
    static SIN_STOCK = 'Sin stock';
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
    static BEIGE = 'bg-[#DEB887]'
    static SALMON = 'bg-[#E9967A]'

    //Product colors
    static RED = "bg-red-500"
    static BLUE = "bg-[#6495ED]"
    static YELLOW = "bg-[#DAA520]"
    static WHITE = "bg-[#DCDCDC]"
    static BLACK = "bg-gray-950"
}

export class BorderColors
{
    static RED = 'border-red-200';
    static YELLOW = 'border-orange-200';
    static BLUE = 'border-blue-300';
    static GREEN = 'border-teal-200';
    static GRAY = 'border-slate-400'
}

export class FillColors
{
    static YELLOW = 'fill-[#DAA520]';
    static GRAY = 'fill-[#778899]'
    static DARK_YELLOW = 'fill-yellow-950';
    static DARK_GREEN = 'fill-slate-900'
    static DARK_GRAY = 'fill-slate-600'
    static DARK_BEIGE = 'fill-slate-800'
    static DARK_RED = 'fill-red-950'
    static WHITE = 'fill-[#F0F8FF]'
    static DARK_PURPLE = 'fill-[#262240]'
}

export class ContrastTextColors 
{
    static YELLOW = 'text-yellow-950' 
    static GREEN = 'text-slate-900'
    static GRAY = 'text-gray-900'
    static RED = 'text-red-950'
    static BEIGE = 'text-slate-800'
    static PURPLE = 'text-[#262240]'
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
    static PEQUENIOS_DISPOSITIVOS = 'Dispositivos';
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

export class RatingType
{
    static EXCELLENT = "Excelente";      //5
    static GREAT = "Sobresaliente";     //4.5
    static VERY_GOOD = "Muy bueno";     //4
    static GOOD = "Bueno";              //3.5
    static REGULAR = "Regular"          //3 - 2.5
    static BAD = "Malo"                 //2 - 1.5
    static HORRIBLE = "Pésimo"          //1 - 0
    static UNKNOWN = "Sin calificación"          //1 - 0
}