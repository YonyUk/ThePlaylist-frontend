import { useState } from "react";
import EditableField from "~/components/editablefield/editablefield";
import type { Route } from "./+types/settings";
import { UserService } from "~/services/UserService";
import { Form, redirect } from "react-router";
import { ROUTES } from "~/routes";
import type { AxiosError } from "axios";
import type { UserDto } from "~/dtos/userdtos";
import type { ValidationError } from "~/types/responsetypes";

export async function clientLoader({ params }: Route.ClientLoaderArgs) {
    const service = UserService.get();
    try {
        const authenticated = await service.authenticated();
        if (authenticated) {
            const response = await service.getInfo();
            return response.data;
        } else {
            return redirect(ROUTES.LOGIN);
        }
    } catch (error) {
        return redirect(ROUTES.LOGIN);
    }
}

export async function clientAction({ request }: Route.ClientActionArgs) {
    const service = UserService.get();


    const formData = await request.formData();

    try {
        const userInfo = await service.getInfo();

        const username_ = formData.get("username");
        const email_ = formData.get("email");
        const password_ = formData.get("password");
        const confirm_ = formData.get("verify-password");

        if (userInfo.status === 200) {
            const username = username_ ? String(username_) : userInfo.data.username;
            const email = email_ ? String(email_) : userInfo.data.email;
            const password = password_ ? String(password_) : confirm_ ? String(confirm_) : null;
            if (!(username.length > 0 && email.length > 0))
                return null;
            const response = await service.updateInfo(userInfo.data.id, {
                username,
                email,
                password
            });
            return response.data;
        }
        else if (userInfo.status === 401)
            return redirect(ROUTES.LOGIN);
    } catch (error) {
        return (error as AxiosError).response?.data;
    }
}

export default function Settings({ actionData, loaderData }: Route.ComponentProps) {

    const [username, setUsername] = useState(String(loaderData?.username));
    const [email, setEmail] = useState(String(loaderData?.email));
    const [password, setPassword] = useState('');
    const [confirm, setConfirm] = useState('');
    const [validUsername, setValidUsername] = useState(loaderData !== undefined);
    const [validEmail, setValidEmail] = useState(loaderData !== undefined);
    const [validPassword, setValidPassword] = useState(true);

    const validateField = (field: string) => field.length > 0;
    const validatePassword = () => password === confirm;

    const validationError = (actionData as ValidationError)?.detail;

    const invalidEmailDetail = validationError ? validationError.find(
        detail => detail.loc[1] === 'email'
    ) : null;

    const invalidUsernameDetail = validationError ? validationError.find(
        detail => detail.loc[1] === 'username'
    ) : null;

    const invalidPasswordDetail = validationError ? validationError.find(
        detail => detail.loc[1] === "password"
    ) : null;

    return (
        <Form
            method="post"
            className="flex flex-col w-full h-full pt-20 items-center justify-center pl-18">
            <input type="hidden" name="username" value={username} />
            <input type="hidden" name="email" value={email} />
            <input type="hidden" name="password" value={password} />
            <input type="hidden" name="verify-password" value={confirm} />
            <EditableField
                id="username"
                name="username"
                type="text"
                value={username}
                valid={validUsername && !invalidUsernameDetail}
                invalidDescription={invalidUsernameDetail ? invalidUsernameDetail.msg : "username field must be filled"}
                onEditCallback={setUsername}
                onEditEnd={() => setValidUsername(validateField(username))}
            />
            <EditableField
                id="email"
                name="email"
                type="email"
                value={email}
                valid={validEmail && !invalidEmailDetail}
                invalidDescription={invalidEmailDetail ? invalidEmailDetail.msg : "email field must be filled"}
                onEditCallback={setEmail}
                onEditEnd={() => setValidEmail(validateField(email))}
            />
            <EditableField
                id="password"
                name="password"
                type="password"
                value={password}
                valid={validPassword && !invalidPasswordDetail}
                invalidDescription={invalidPasswordDetail ? invalidPasswordDetail.msg : "passwords does not matchs"}
                onEditCallback={setPassword}
                onEditEnd={() => setValidPassword(validatePassword())}
            />
            <EditableField
                id="verify-password"
                name="verify-password"
                type="password"
                valid={validPassword}
                value={confirm}
                invalidDescription="passwords does not matchs"
                onEditCallback={setConfirm}
                onEditEnd={() => setValidPassword(validatePassword())}
            />
            <div className="flex flex-row w-full justify-center items-center gap-20 mt-5">
                <button
                    className="cursor-pointer rounded-md px-2 p-1 bg-[#00000025] duration-300 hover:bg-[#00000035]"
                    type="submit"
                >
                    Save
                </button>
                <button
                    className="cursor-pointer rounded-md px-2 p-1 bg-[#00000025] duration-300 hover:bg-[#00000035]"
                >
                    Cancel
                </button>
            </div>
        </Form>
    );
}