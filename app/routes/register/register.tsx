import { Form, useNavigate } from "react-router";
import { useState } from "react";
import type { Route } from "./+types/register";
import { UserService } from "~/services/UserService";
import type { ValidationError, ValidationErrorDetail } from "~/types/responsetypes";
import { ROUTES } from "~/routes";

export async function action({ request }: Route.ActionArgs) {
    const formData = await request.formData();
    const username = String(formData.get('username'));
    const email = String(formData.get('email'));
    const password = String(formData.get('password'));
    const confirm = String(formData.get('confirm-password'));

    if (username.length * email.length * password.length == 0) {
        return null;
    }
    else if (password.length !== confirm.length) {
        return null;
    }
    else {
        const response = await UserService.get().create({
            username,
            email,
            password
        });
        return response;
    }
}

export default function Register({ actionData, loaderData }: Route.ComponentProps) {

    const navigate = useNavigate();

    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, SetPassword] = useState('');
    const [confirm, setConfirm] = useState('');
    const [attempted, setAttempted] = useState(false);

    const validateField = (field: string) => field.length > 0;
    const validatePassword = () => password === confirm;

    const validationsDetails = (actionData?.data as ValidationError)?.detail;
    const usernameValidationDetails = validationsDetails?.find(
        detail => detail.loc[1] === 'username'
    );
    const emailValidationDetails = validationsDetails?.find(
        detail => detail.loc[1] === 'email'
    );
    const passwordValidationDetails = validationsDetails?.find(
        detail => detail.loc[1] === 'password'
    )

    const networkError = actionData &&
        (actionData?.data as any) &&
        'msg' in (actionData?.data as any);

    if (networkError)
        alert((actionData?.data as any).msg);

    if (actionData && !networkError && !validationsDetails)
        navigate(ROUTES.HOME);

    return (
        <div className="flex flex-col h-screen w-full pl-18 justify-center items-center">
            <Form
                method="post"
                className="flex flex-col p-5 px-10 w-fit justify-center items-center bg-[#c0c0c025]
                rounded-md backdrop-blur-xs gap-5">
                <div>
                    <h1>Register</h1>
                </div>
                <div>
                    <p className="text-red-500 text-[10px] pl-2">
                        {`${attempted && !validateField(username) ? 'required field' :
                            usernameValidationDetails ? usernameValidationDetails.msg : ''}`}
                    </p>
                    <input type="text" name="username" id="username"
                        placeholder="username"
                        onChange={(e) => setUsername(e.target.value)}
                        className={`outline-none rounded-md bg-[#00000015] p-2 
                    ${(attempted && !validateField(username) || usernameValidationDetails) && "border-[1px] border-red-500"}`} />
                </div>
                <div>
                    <p className="text-red-500 text-[10px] pl-2">
                        {`${attempted && !validateField(email) ? 'required field' :
                            emailValidationDetails ? emailValidationDetails.msg : ''}`}</p>
                    <input type="email" name="email" id="email"
                        placeholder="email"
                        onChange={(e) => setEmail(e.target.value)}
                        className={`outline-none rounded-md bg-[#00000015] p-2
                    ${(attempted && !validateField(email) || emailValidationDetails) && "border-[1px] border-red-500"}`} />
                </div>
                <div>
                    <p className="text-red-500 text-[10px] pl-2">
                        {!validatePassword() ? 'passwords do not matchs' :
                            `${attempted && !validateField(password) ? 'required field' :
                                passwordValidationDetails ? passwordValidationDetails.msg : ''}`}
                    </p>
                    <input type="password" name="password" id="password"
                        placeholder="password"
                        onChange={(e) => SetPassword(e.target.value)}
                        className={`outline-none rounded-md bg-[#00000015] p-2
                    ${(attempted && !validateField(password) && validatePassword()
                                || passwordValidationDetails) &&
                            "border-[1px] border-red-500"}
                    `} />
                </div>
                <div>
                    <p className="text-red-500 text-[10px] pl-2">
                        {!validatePassword() ? 'passwords do not match' : `${attempted && !validateField(confirm) ? 'required field' : ''}`}
                    </p>
                    <input type="password" name="confirm-password" id="confirm-password"
                        placeholder="confirm password"
                        onChange={(e) => setConfirm(e.target.value)}
                        className={`outline-none rounded-md bg-[#00000015] p-2
                    ${attempted && !validateField(confirm) && validatePassword() && "border-[1px] border-red-500"}`} />
                </div>
                <div className="text-[#ffffff75] text-[12px] flex flex-start">
                    <p>ALready registered?,</p><u className="cursor-pointer text-[#ffffff]"> login</u>
                </div>
                <div className="flex flex-row justify-around items-center p-2 w-full">
                    <button
                        type="submit"
                        onClick={() => setAttempted(true)}
                        className="cursor-pointer hover:bg-[#00000045] rounded-md duration-300 p-1"
                    >Register</button>
                    <button className="cursor-pointer hover:bg-[#00000045] rounded-md duration-300 p-1">Cancel</button>
                </div>

            </Form>
        </div>
    )
};