import SideBar from "~/components/sidebar/sidebar";
import Register from "./register/register";
import type { Route } from "./register/+types/register";

export async function clientAction({request}:Route.ClientActionArgs){
    const formData = await request.formData();
    const username = formData.get('username');
    const email = formData.get('email');
    const password = formData.get('password');
    const confirmPassword = formData.get('confirm-password');
}

const Account = () => {
    return (
        <div className="flex flex-col h-screen w-full pl-18 justify-center items-center">
            <SideBar />
            {
                <Register/>
            }
        </div>
    )
};

export default Account;