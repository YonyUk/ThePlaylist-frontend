import { Outlet, useLocation, useNavigate } from "react-router";
import { ROUTES } from "~/routes";
import type { Route } from "./+types/account";
import { MdLogout } from "react-icons/md";
import { UserService } from "~/services/UserService";

export default function Account({ actionData }: Route.ComponentProps) {

    const menuItems = [
        {
            label: 'Settings',
            url: ROUTES.SETTINGS
        },
        {
            label: 'MyPlaylists',
            url: `${ROUTES.MYPLAYLISTS}/0`
        },
        {
            label: 'MyTracks',
            url: `${ROUTES.MYTRACKS}/0`
        }
    ]

    const location = useLocation();
    const navigate = useNavigate();

    const isSubPath = (itemUrl:string) => {
        const index = itemUrl.indexOf('/',1);
        const subpath = itemUrl.substring(0,index);
        return subpath.length !== 0 ? location.pathname.startsWith(subpath) : location.pathname === itemUrl;
    }

    const logout = async () => {
        const service = UserService.get();
        const response = await service.logout();
        if (response)
            navigate(ROUTES.LOGIN);
        else
            alert("ERROR WHILE LOGOUT");
    }

    const navigateTo = (url: string) => {
        if (location.pathname !== url)
            navigate(url)
    }

    return (
        <div className="h-90/100">
            <nav className="pl-18 pt-2 bg-[#00000090]">
                <div className="flex flex-row w-full justify-end gap-3">
                    {
                        menuItems.map((item, index) =>
                            <div
                                key={index}
                                className={`rounded-t-md cursor-pointer p-2 px-4 duration-300
                             hover:bg-[#00000040] hover:border-b-1 
                             ${isSubPath(item.url) && "bg-[#00000040] border-b-1"}`}
                                onClick={() => navigateTo(item.url)}
                            >
                                {item.label}
                            </div>
                        )
                    }
                    <div
                        className="flex flex-row p-1 px-4 bg-[#00000045] m-2 rounded-md gap-2 cursor-pointer"
                        onClick={logout}
                    >
                        <h1>Logout</h1>
                        <MdLogout size={20} />
                    </div>
                </div>
            </nav>
            <Outlet />
        </div>
    );
}