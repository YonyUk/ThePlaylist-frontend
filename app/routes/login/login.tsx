import { Form, redirect } from "react-router";
import type { Route } from "./+types/login";
import { UserService } from "~/services/UserService";
import { useNavigate } from "react-router";
import { useState } from "react";
import { ROUTES } from "~/routes";

export async function clientAction({ request }: Route.ClientActionArgs) {
    const service = UserService.get();
    const formData = await request.formData()
    const username = String(formData.get('username'));
    const password = String(formData.get('password'));

    const response = await service.authenticate(username, password);
    if (response.status === 201){
        return redirect(ROUTES.HOME);
    }
    if (response.status !== 422)
        return response.data;
    return null;
}

export async function clientLoader({request}:Route.ClientLoaderArgs){
    const service = UserService.get();
    const authenticated = await service.authenticated();
    if (authenticated)
        return redirect(ROUTES.HOME);
    return null;
}

export default function Login({ actionData, loaderData }: Route.ComponentProps) {

    const navigate = useNavigate();

    const [sended, setSended] = useState(false);

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const msg = (actionData as any)?.msg ? (actionData as any)?.msg : (actionData as any)?.detail;

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