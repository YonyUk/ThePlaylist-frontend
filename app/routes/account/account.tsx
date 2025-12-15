import { Outlet } from "react-router";
import { ROUTES } from "~/routes";

export default function Account() {

    const menuItems = [
        {
            label:'Settings',
            url:ROUTES.SETTINGS
        }
    ]

    return (
        <>
            <nav className="pl-18 pt-2 bg-[#00000090]">
                <div className="flex flex-row w-full justify-end gap-3">
                    {
                        menuItems.map(item => 
                            <div
                            className="rounded-t-md cursor-pointer p-2 px-4 duration-300 hover:bg-[#00000040] hover:border-b-1">
                                {item.label}
                            </div>
                        )
                    }
                </div>
            </nav>
            <Outlet />
        </>
    );
}