import { Estado,Colores } from "@prisma/client";

//Cuasi DTOs
export default class ProductoMapper
{
    static toState(state : string) : Estado
    {
        switch(state.toLowerCase())
        {
            case 'nuevo':
                return Estado.NUEVO;
            case 'usado':
                return Estado.USADO;
            default:
                return Estado.NUEVO;
        }
    }

    static fromState(state : Estado) : string
    {
        switch(state)
        {
            case Estado.NUEVO:
                return 'nuevo';
            case Estado.USADO:
                return 'usado';
            default:
                return 'nuevo';
        }
    }

    static toColorArray(colors : string[]) : Colores[]
    {
        let result : Colores[] = [];

        colors.forEach(color =>
            {
                switch(color.toLowerCase())
                {
                    case 'rojo':
                        result.concat(Colores.ROJO);
                    case 'naranja':
                        result.concat(Colores.NARANJA);
                    case 'azul':
                        result.concat(Colores.AZUL);
                    case 'verde':
                        result.concat(Colores.VERDE);
                }
            })

        return result;      
    }

    static fromColorArray(colors : Colores[]) : string[]
    {
        let result : string[] = [];

        colors.forEach(color =>
            {
                switch(color)
                {
                    case Colores.ROJO:
                        result.concat('rojo');
                    case Colores.NARANJA:
                        result.concat('naranja');
                    case Colores.VERDE:
                        result.concat('verde');
                    case Colores.AZUL:
                        result.concat('azul');
                }
            })

        return result;    
    }
}