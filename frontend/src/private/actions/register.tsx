'use server'

//Get countries, banks, organizations
export async function getRegisterFieldsSSA()
{
    //const token = cookies().get(ACCESS_TOKEN)?.value!;
    const countriesFetch = fetchUsersApi('api/countries');
    const banksFetch = fetchUsersApi('api/banks');
    const orgsFetch = fetchUsersApi('api/organizations');

    const result = await Promise.all([countriesFetch,banksFetch,orgsFetch]).then(async vals => 
        {
            const countries = await vals[0].json();
            const banks = await vals[1].json();
            const orgs = await vals[2].json();
            return {ok : true, countries, banks, orgs};
        },
        err => {console.log(err); return {ok : false, countries : null, banks : null, orgs : null}}
    )
    return result;
}

async function fetchUsersApi(endpoint : string)
{
    return fetch(`${process.env.NEXT_PUBLIC_ms_usuarios_host}/${endpoint}`,
      { 
        method : 'GET',
        mode : 'cors',
        headers: 
        {
          "Authorization":    `Basic ${process.env.NEXT_PUBLIC_clients_key}`,
          "Accept":           "application/json",
        },
      }
    )
    .then
    (   res => 
        {
            if(res.ok) return res;
            else throw new Error(`Ms_users request resolved to ${res.status}`);
        }
    );
}