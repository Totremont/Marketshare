import FooterComponent from "@/components/footer";
import HeaderComponent from "@/components/header";
import { ROLE_COMPRADOR, USERNAME_HEADER, USER_ROLE_HEADER } from "@/middleware";
import { headers } from "next/headers";
import { findUserByUsernameSSA } from "@/private/actions/home";
import { formatPrice } from "@/private/utils/mappers";

export default async function MainLayout({children,}: {children: React.ReactNode}) 
{
    const username = headers().get(USERNAME_HEADER)!;
    const role = headers().get(USER_ROLE_HEADER)!;
    const user = await findUserByUsernameSSA(username!);
    const money = user.money ?? 0;
    const bank = user.bank?.name ?? '';

    const updateUserMoney = (money : number) =>
    {
        
    }

    const view = 
    (

        <main className="bg-gray-900 flex flex-col h-fit w-screen">
            <HeaderComponent userId={user.id} username={username} money={money} role={role} bankName={bank}/>
            <div className="flex-1 py-[100px]">
            {children}
            </div>
            <FooterComponent/>
        </main>

    )
    return view;
}