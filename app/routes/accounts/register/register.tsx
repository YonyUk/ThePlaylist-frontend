import { useState } from "react";
import { Form } from "react-router";

const Register = () => {

    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, SetPassword] = useState('');
    const [confirm, setConfirm] = useState('');
    const [attempted, setAttempted] = useState(false);

    const validateField = (field: string) => field.length > 0;
    const validatePassword = () => password === confirm;

    return (
        <Form
            method="post"
            className="flex flex-col p-5 px-10 w-fit justify-center items-center bg-[#c0c0c025]
                rounded-md backdrop-blur-xs gap-5">
            <div>
                <h1>Register</h1>
            </div>
            <div>
                <p className="text-red-500 text-[10px] pl-2">{`${attempted && !validateField(username) ? 'required field' : ''}`}</p>
                <input type="text" name="username" id="username"
                    placeholder="username"
                    onChange={(e) => setUsername(e.target.value)}
                    className={`outline-none rounded-md bg-[#00000015] p-2 
                    ${attempted && !validateField(username) && "border-[1px] border-red-500"}`} />
            </div>
            <div>
                <p className="text-red-500 text-[10px] pl-2">{`${attempted && !validateField(email) ? 'required field' : ''}`}</p>
                <input type="email" name="email" id="email"
                    placeholder="email"
                    onChange={(e) => setEmail(e.target.value)}
                    className={`outline-none rounded-md bg-[#00000015] p-2
                    ${attempted && !validateField(email) && "border-[1px] border-red-500"}`} />
            </div>
            <div>
                <p className="text-red-500 text-[10px] pl-2">
                    {!validatePassword()? 'passwords do not matchs' : `${attempted && !validateField(password) ? 'required field' : ''}`}
                </p>
                <input type="password" name="password" id="password"
                    placeholder="password"
                    onChange={(e) => SetPassword(e.target.value)}
                    className={`outline-none rounded-md bg-[#00000015] p-2
                    ${attempted && !validateField(password) && !validatePassword() && "border-[1px] border-red-500"}
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
                    ${attempted && !validateField(confirm) && !validatePassword() && "border-[1px] border-red-500"}`} />
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
    )
};

export default Register;