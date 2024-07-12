

export function getNamedRole(rawRole : string)
{
    if(rawRole === 'ROLE_COMPRADOR') return 'COMPRADOR';
    else return 'VENDEDOR';
}