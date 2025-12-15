import { useState } from "react";
import { Form, redirect, useNavigate } from "react-router";
import { ROUTES } from "~/routes";
import type { Route } from "./+types/login";
import { UserService, type TokenSchema } from "~/services/UserService";
import Cookies from "js-cookie";
import { jwtDecode } from 'jwt-decode';

export async function action({ request }: Route.ActionArgs) {
    const formData = await request.formData();
    const username = String(formData.get('username'));
    const password = String(formData.get('password'));

    const response = await UserService.get().authenticate(username, password);
    if (response.status !== 422)
        return response.data;
    return null;
}

export async function clientLoader({params}:Route.ClientLoaderArgs){
    if (Cookies.get('access_token'))
        return redirect(ROUTES.HOME);
    return null;
}

export default function Login({ actionData, loaderData }: Route.ComponentProps) {

    const navigate = useNavigate();
    
    const [sended, setSended] = useState(false);

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const msg = (actionData as any)?.msg ? (actionData as any)?.msg : (actionData as any)?.detail;

    if (actionData && !msg) {
        const access_token = (actionData as TokenSchema).access_token;
        const token = Cookies.get('access_token');
        if (!token) {
            const decoded = jwtDecode(access_token);
            const expires = decoded.exp ? decoded.exp * 1000 : 10000;
            Cookies.set('access_token', access_token, {
                expires: new Date(expires),
                sameSite: 'Strict'
            });
            navigate(ROUTES.HOME);
        }
    }

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
                    sended && msg &&
                    <p className="text-red-500 text-[10px]">{msg}</p>
                }
                <div>
                    {
                        sended && username.length === 0 &&
                        <p className="text-[10px] text-red-500">Required field</p>
                    }
                    <input type="text" name="username" id="username"
                        placeholder="username"
                        onChange={(e) => setUsername(e.target.value)}
                        className={`outline-none rounded-md bg-[#00000015] p-2
                            ${sended && username.length === 0 ? 'border-[1px] border-red-500' : ''}
                        `}
                    />
                </div>
                <div>
                    {
                        sended && password.length === 0 &&
                        <p className="text-[10px] text-red-500">Required field</p>
                    }
                    <input type="password" name="password" id="password"
                        placeholder="password"
                        onChange={(e) => setPassword(e.target.value)}
                        className={`outline-none rounded-md bg-[#00000015] p-2
                            ${sended && password.length === 0 ? 'border-[1px] border-red-500' : ''}
                        `}
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
                        onClick={() => {
                            setSended(true);
                        }}
                        className="cursor-pointer hover:bg-[#00000045] rounded-md duration-300 p-1">
                        Login</button>
                    <button className="cursor-pointer hover:bg-[#00000045] rounded-md duration-300 p-1">
                        Cancel</button>
                </div>
            </Form>
        </div>
    )
}