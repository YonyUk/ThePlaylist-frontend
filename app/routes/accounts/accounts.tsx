import SideBar from "~/components/sidebar/sidebar";
import { AuthService } from "~/services/auth/authservice";
import Register from "./register";

const Account = () => {
    return (
        <div className="flex flex-col h-screen w-full pl-18 justify-center items-center">
            <SideBar />
            {
                !AuthService.userIsAuthenticated() &&
                <Register/>
            }
        </div>
    )
};

export default Account;