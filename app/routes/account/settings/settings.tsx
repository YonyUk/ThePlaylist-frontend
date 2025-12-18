import { useState } from "react";
import EditableField from "~/components/editablefield/editablefield";
import type { Route } from "./+types/settings";
import { UserService } from "~/services/UserService";
import { redirect } from "react-router";
import { ROUTES } from "~/routes";

export async function clientLoader({params}:Route.ClientLoaderArgs){
    const service = UserService.get();
    try {
        const authenticated = await service.authenticated();
        if (authenticated){
            const response = await service.getInfo();
            return response.data;
        } else{
            return redirect(ROUTES.LOGIN);
        }
    } catch (error) {
        return redirect(ROUTES.LOGIN);
    }
}

export default function Settings({loaderData}:Route.ComponentProps) {

    const [username,setUsername] = useState(String(loaderData?.username));
    const [email,setEmail] = useState(String(loaderData?.email));
    const [password,setPassword] = useState('');
    const [confirm,setConfirm] = useState('');
    const [validUsername,setValidUsername] = useState(loaderData !== undefined);
    const [validEmail,setValidEmail] = useState(loaderData !== undefined);
    const [validPassword,setValidPassword] = useState(true);

    const validateField = (field:string) => field.length > 0;
    const validatePassword = () => password === confirm;

    return (
        <div className="flex flex-col w-full h-full pt-20 items-center justify-center pl-18">
            <EditableField
            id="username"
            name="username"
            type="text"
            value={username}
            valid={validUsername}
            invalidDescription="username field must be filled"
            onEditCallback={setUsername}
            onEditEnd={() => setValidUsername(validateField(username))}
            />
            <EditableField
            id="email"
            name="email"
            type="email"
            valid={validEmail}
            value={email}
            invalidDescription="email field must be filled"
            onEditCallback={setEmail}
            onEditEnd={() => setValidEmail(validateField(email))}
            />
            <EditableField
            id="password"
            name="password"
            type="password"
            valid={validPassword}
            invalidDescription="passwords does not matchs"
            onEditCallback={setPassword}
            onEditEnd={() => setValidPassword(validatePassword())}
            />
            <EditableField
            id="verify-password"
            name="verify-password"
            type="password"
            valid={validPassword}
            invalidDescription="passwords does not matchs"
            onEditCallback={setConfirm}
            onEditEnd={() => setValidPassword(validatePassword())}
            />
            <button onClick={() => console.log(username)}>Click</button>
        </div>
    );
}