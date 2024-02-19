
export default class RequestStatus
{
    static OK = 200;
    static NOT_FOUND = 404;
    static UNAUTHORIZED = 401;
    static BAD_REQUEST = 400;
    static INTERNAL = 500;

    static CORS_HEADERS = 
    {
        'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization'
    }
}