export var iconStyle = 'fill-slate-300';

export function CardIcon()
{
    return <svg className={iconStyle} xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24"><path d="M160-160q-33 0-56.5-23.5T80-240v-480q0-33 23.5-56.5T160-800h640q33 0 56.5 23.5T880-720v480q0 33-23.5 56.5T800-160H160Zm0-320h640v-160H160v160Z"/></svg>;
}

export function LeafIcon()
{
    return <svg className={iconStyle} xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24"><path d="M450-80q-33 0-66.5-7.5T315-109q12-121 70-226t149-185q-110 56-190.5 148T231-162q-4-3-7.5-6.5L216-176q-47-47-71.5-105T120-402q0-68 27-130t75-110q81-81 210-105.5t362-4.5q18 239-6 364.5T684-182q-49 49-109.5 75.5T450-80Z"/></svg>
}

export function ShieldIcon()
{
    return <svg className={iconStyle} xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24"><path d="M480-80q-139-35-229.5-159.5T160-516v-244l320-120 320 120v244q0 152-90.5 276.5T480-80Z"/></svg>
}

export function ShippingIcon()
{
    return <svg className={iconStyle} xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24"><path d="M240-160q-50 0-85-35t-35-85H40v-440q0-33 23.5-56.5T120-800h560v160h120l120 160v200h-80q0 50-35 85t-85 35q-50 0-85-35t-35-85H360q0 50-35 85t-85 35Zm0-80q17 0 28.5-11.5T280-280q0-17-11.5-28.5T240-320q-17 0-28.5 11.5T200-280q0 17 11.5 28.5T240-240Zm480 0q17 0 28.5-11.5T760-280q0-17-11.5-28.5T720-320q-17 0-28.5 11.5T680-280q0 17 11.5 28.5T720-240Zm-40-200h170l-90-120h-80v120Z"/></svg>
}

export function CashIcon()
{
    return <svg className={iconStyle} xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24"><path d="M600-320h120q17 0 28.5-11.5T760-360v-240q0-17-11.5-28.5T720-640H600q-17 0-28.5 11.5T560-600v240q0 17 11.5 28.5T600-320Zm40-80v-160h40v160h-40Zm-280 80h120q17 0 28.5-11.5T520-360v-240q0-17-11.5-28.5T480-640H360q-17 0-28.5 11.5T320-600v240q0 17 11.5 28.5T360-320Zm40-80v-160h40v160h-40Zm-200 80h80v-320h-80v320ZM80-160v-640h800v640H80Zm80-560v480-480Zm0 480h640v-480H160v480Z"/></svg>
}

export function CheckbookIcon()
{
    return <svg className={iconStyle} xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24"><path d="M80-200v-560h800v120h-80L600-440H240v80h280L360-200H80Zm160-320h240v-80H240v80Zm280 400v-70l266-266 70 70-266 266h-70Zm360-290-70-70 36-36q5-5 11-5t11 5l48 48q5 5 5 11t-5 11l-36 36Z"/></svg>
}

export function CreditCardIcon()
{
    return <svg className={iconStyle} xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24"><path d="M160-160q-33 0-56.5-23.5T80-240v-480q0-33 23.5-56.5T160-800h640q33 0 56.5 23.5T880-720v480q0 33-23.5 56.5T800-160H160Zm0-320h640v-160H160v160Z"/></svg>
}

export function ShoppingIcon()
{
    return <svg className={iconStyle} xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24"><path d="M280-80q-33 0-56.5-23.5T200-160q0-33 23.5-56.5T280-240q33 0 56.5 23.5T360-160q0 33-23.5 56.5T280-80Zm400 0q-33 0-56.5-23.5T600-160q0-33 23.5-56.5T680-240q33 0 56.5 23.5T760-160q0 33-23.5 56.5T680-80ZM208-800h590q23 0 35 20.5t1 41.5L692-482q-11 20-29.5 31T622-440H324l-44 80h480v80H280q-45 0-68-39.5t-2-78.5l54-98-144-304H40v-80h130l38 80Z"/></svg>
}

export function MarkIcon()
{
    return <svg className={iconStyle} xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24"><path d="M570-104q-23 23-57 23t-57-23L104-456q-11-11-17.5-26T80-514v-286q0-33 23.5-56.5T160-880h286q17 0 32 6.5t26 17.5l352 353q23 23 23 56.5T856-390L570-104Zm-57-56 286-286-353-354H160v286l353 354ZM260-640q25 0 42.5-17.5T320-700q0-25-17.5-42.5T260-760q-25 0-42.5 17.5T200-700q0 25 17.5 42.5T260-640ZM160-800Z"/></svg>
}

export function LockIcon(props : {size : string})
{
    return <svg className={`${iconStyle} ${props.size}`} xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24"><path d="M240-80q-33 0-56.5-23.5T160-160v-400q0-33 23.5-56.5T240-640h40v-80q0-83 58.5-141.5T480-920q83 0 141.5 58.5T680-720v80h40q33 0 56.5 23.5T800-560v400q0 33-23.5 56.5T720-80H240Zm240-200q33 0 56.5-23.5T560-360q0-33-23.5-56.5T480-440q-33 0-56.5 23.5T400-360q0 33 23.5 56.5T480-280ZM360-640h240v-80q0-50-35-85t-85-35q-50 0-85 35t-35 85v80Z"/></svg>
}

export function StarIcon(props : {size : string, fillColor : string})
{
    return <svg className={`${props.fillColor} ${props.size}`} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M12,17.27L18.18,21L16.54,13.97L22,9.24L14.81,8.62L12,2L9.19,8.62L2,9.24L7.45,13.97L5.82,21L12,17.27Z" /></svg>
}

export function HalfStarIcon(props : {size : string, fillColor : string})
{
    return <svg className={`${props.fillColor} ${props.size}`} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M12,15.4V6.1L13.71,10.13L18.09,10.5L14.77,13.39L15.76,17.67M22,9.24L14.81,8.63L12,2L9.19,8.63L2,9.24L7.45,13.97L5.82,21L12,17.27L18.18,21L16.54,13.97L22,9.24Z" /></svg>
}

export function HalfStar2Icon(props : {size : string, fillColor : string})
{
    return <svg className={`${props.fillColor} ${props.size}`} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M12 2L9.19 8.62L2 9.24L7.45 13.97L5.82 21L12 17.27V2Z" /></svg>
}

export function CheckIcon(props : {size : string, fillColor : string})
{
    return <svg className={`${props.fillColor} ${props.size}`} xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24"><path d="m424-296 282-282-56-56-226 226-114-114-56 56 170 170Zm56 216q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Z"/></svg>
}

export function PendingIcon(props : {size : string, fillColor : string})
{
    return <svg className={`${props.fillColor} ${props.size}`} xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24"><path d="M280-420q25 0 42.5-17.5T340-480q0-25-17.5-42.5T280-540q-25 0-42.5 17.5T220-480q0 25 17.5 42.5T280-420Zm200 0q25 0 42.5-17.5T540-480q0-25-17.5-42.5T480-540q-25 0-42.5 17.5T420-480q0 25 17.5 42.5T480-420Zm200 0q25 0 42.5-17.5T740-480q0-25-17.5-42.5T680-540q-25 0-42.5 17.5T620-480q0 25 17.5 42.5T680-420ZM480-80q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Z"/></svg>
}

export function UndoIcon(props : {size : string, fillColor : string})
{
    return <svg className={`${props.fillColor} ${props.size}`} xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24"><path d="M280-200v-80h284q63 0 109.5-40T720-420q0-60-46.5-100T564-560H312l104 104-56 56-200-200 200-200 56 56-104 104h252q97 0 166.5 63T800-420q0 94-69.5 157T564-200H280Z"/></svg>
}

