import { useState } from "react";
import { Form, useNavigate } from "react-router";
import { ROUTES } from "~/routes";
import type { Route } from "./+types/login";
import { UserService } from "~/services/UserService";
import Cookies from "js-cookie";

export async function action({request}:Route.ActionArgs){
    const formData = await request.formData();
    const username = String(formData.get('username'));
    const password = String(formData.get('password'));

    const response = await UserService.get().authenticate(username,password);
    return response;
}

export default function Login({actionData,loaderData}:Route.ComponentProps) {

    const navigate = useNavigate();

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    return (
        <div className="flex flex-col h-screen w-full pl-18 justify-center items-center">
            <Form
                method="post"
                className="flex flex-col p-5 px-10 w-fit justify-center items-center bg-[#c0c0c025]
                rounded-md backdrop-blur-xs gap-5">
                <div>
                    <h1>Login</h1>
                </div>
                {
                    !actionData &&
                    <p className="text-red-500 text-[10px]">Incorrect username or password</p>
                }
                <div>
                    <input type="text" name="username" id="username"
                        placeholder="username"
                        className="outline-none rounded-md bg-[#00000015] p-2"
                        onChange={(e) => setUsername(e.target.value)}
                    />
                </div>
                <div>
                    <input type="password" name="password" id="password"
                        placeholder="password"
                        className="outline-none rounded-md bg-[#00000015] p-2"
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </div>
                <div className="text-[#ffffff75] text-[12px] flex flex-start">
                    <p>Don't have an account yet?,</p>
                    <u className="cursor-pointer text-[#ffffff]"
                        onClick={() => navigate(ROUTES.REGISTER)}> register</u>
                </div>
                <div className="flex flex-row justify-around items-center p-2 w-full">
                    <button
                        type="submit"
                        className="cursor-pointer hover:bg-[#00000045] rounded-md duration-300 p-1">
                        Login</button>
                    <button className="cursor-pointer hover:bg-[#00000045] rounded-md duration-300 p-1">
                        Cancel</button>
                </div>
            </Form>
        </div>
    )
}