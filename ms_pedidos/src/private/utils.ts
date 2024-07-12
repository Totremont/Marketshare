
//From YYYY-MM-DDTHH:mm:ss.sssZ to DD-MM-YYYY
export function formatDate(date : string, getTime = false)
{
    const splits = date.split('-');
    const day = splits[2].slice(0,2);
    const month = splits[1];
    const year = splits[0];
    const time = getTime ? splits[2].slice(3,11) : null;
    let monthName;
    switch(month)
    {
        case '01':
        monthName = 'Enero';
        break;
        case '02':
        monthName = 'Febrero';
        break;
        case '03':
        monthName = 'Marzo';
        break;
        case '04':
        monthName = 'Abril';
        break;
        case '05':
        monthName = 'Mayo';
        break;
        case '06':
        monthName = 'Junio';
        break;
        case '07':
        monthName = 'Julio';
        break;
        case '08':
        monthName = 'Agosto';
        break;
        case '09':
        monthName = 'Septiembre';
        break;
        case '10':
        monthName = 'Octubre';
        break;
        case '11':
        monthName = 'Noviembre';
        break;
        case '12':
        monthName = 'Diciembre';
        break;
    }

    return `${day} de ${monthName} ${year} ${time ? '| ' + time : '' }`;
}