import FooterComponent from "@/components/footer";
import HeaderComponent from "@/components/header";
import { ROLE_COMPRADOR, USERNAME_HEADER, USER_ROLE_HEADER } from "@/middleware";
import { headers } from "next/headers";
import { findUserByUsernameSSA } from "@/private/actions/home";
import { formatPrice } from "@/private/utils/mappers";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: 'Principal',
  };
  
export default async function MainLayout({children,}: {children: React.ReactNode}) 
{
    const username = headers().get(USERNAME_HEADER)!;
    const user = await findUserByUsernameSSA(username!);

    const view = 
    (

        <main className="bg-gray-900 flex flex-col h-fit w-screen">
            <HeaderComponent user={user}/>
            <div className="flex-1 py-[100px]">
                {children}
            </div>
            <FooterComponent/>
        </main>

    )
    return view;
}