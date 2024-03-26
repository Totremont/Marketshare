'use client'
import React from "react";


export const ERROR_NOT_FOUND = 0;
export const ERROR_MISSING_DATA = 1;

export function ErrorPage(props : {errorType : number, onClick : any})
{
    let type : string;
    let title : string;
    let subtitle : string;
    if(props.errorType === ERROR_NOT_FOUND)
    {
        type = '404 | Página desconocida';
        title = 'No encontrado';
        subtitle = 'La página solicitada no existe o se movió.';
    } else if(props.errorType === ERROR_MISSING_DATA)
    {
        type = 'Datos faltantes';
        title = 'Ocurrió un error';
        subtitle = 'La página solicitada requeria un recurso que no pudo ser recuperado.';
    }
    else
    {
        type = 'Desconocido';
        title = 'Ocurrió un error';
        subtitle = 'Lo sentimos, sucedió algo inesperado';
    }

    let view = 
    (     
        <div className="h-screen w-screen bg-gray-900 text-slate-200 p-3 flex items-center justify-center">

        <article>
        <img className="w-[175px] md:w-[210px] block px-2 ms-auto md:ms-0 " src={`/marketshare.svg`}/>
        <section className="md:grid grid-cols-2 gap-4 mx-2 my-3 items-center h-fit">
            <div className="">
            <h3 className="font-semibold text-orange-300 text-sm">{type}</h3>
            <h1 className="text-5xl font-semibold my-5">{title}</h1>
            <h2 className="text-slate-300 mb-8">{subtitle}</h2>
            <button onClick={props.onClick} className="font-semibold text-orange-300 text-sm">Volver</button>
            </div>
            <img src={`/unknown.jpg`} className="my-4"/>
        </section>
        </article>

        </div>
    );
    return view;
}

export class ErrorBoundary extends React.Component 
{
    constructor(props : any) {
      super(props);
      this.state = { hasError: false };
    }
  
    static getDerivedStateFromError(error) {
      // Update state so the next render will show the fallback UI.
      return { hasError: true };
    }
  
    componentDidCatch(error, info) {
      // Example "componentStack":
      //   in ComponentThatThrows (created by App)
      //   in ErrorBoundary (created by App)
      //   in div (created by App)
      //   in App
      //logErrorToMyService(error, info.componentStack);
    }
  
    render() {
      if (this.state.hasError) {
        // You can render any custom fallback UI
        return this.props.fallback;
      }
  
      return this.props.children;
    }
}