import FooterComponent from "@/components/footer";
import HeaderComponent from "@/components/header";
import { ACCESS_TOKEN, USERNAME_HEADER, USER_ROLE_HEADER } from "@/middleware";
import { cookies, headers } from "next/headers";
import { Providers } from "../providers";

export default function MainLayout({children,}: {children: React.ReactNode}) 
{
    const cookie = cookies().get(ACCESS_TOKEN);
    const username = headers().get(USERNAME_HEADER);
    const role = headers().get(USER_ROLE_HEADER);

    const view = 
    (

        <main className="bg-gray-900 flex flex-col">
            <HeaderComponent username={username!}/>
            <div className="flex-1 py-[100px]">
            {children}
            </div>
            <FooterComponent/>
        </main>

    )
    return view;
}