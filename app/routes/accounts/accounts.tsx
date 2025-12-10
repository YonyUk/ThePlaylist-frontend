import SideBar from "~/components/sidebar/sidebar";
import { AuthService } from "~/services/auth/authservice";

const Account = () => {
    return (
        <div className="flex flex-col h-screen w-full pl-18 justify-center items-center">
            <SideBar />
            {
                !AuthService.userIsAuthenticated() &&
                <div className="flex flex-col p-5 w-fit justify-center items-center bg-[#c0c0c025]
                rounded-md backdrop-blur-xs gap-5">
                    <div>
                        <h1>Log in</h1>
                    </div>
                    <input type="text" name="username" id="username"
                    placeholder="username" 
                    className="outline-none rounded-md bg-[#00000015] p-2"/>
                    <input type="password" name="password" id="password" 
                    placeholder="password"
                    className="outline-none rounded-md bg-[#00000015] p-2"/>
                    <div className="text-[#ffffff75] text-[12px] flex flex-start">
                        <p>New here,</p><u className="cursor-pointer text-[#ffffff]"> register</u>
                    </div>
                    <div className="flex flex-row justify-around items-center p-2 w-full">
                        <button>Accept</button>
                        <button>Cancel</button>
                    </div>
                </div>
            }
        </div>
    )
};

export default Account;