import { useState } from "react";

const Register = () => {

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [email, setEmail] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const validatePassword = (password: string, confirm: string) => {
        return password === confirm;
    };

    const validateEmail = (email: string) => {
        return true;
    };

    const register = async (username: string, password: string, confirm: string,email:string) => {
        if (!validatePassword(password, confirmPassword))
            return false;
        if (!validateEmail(email))
            return false;
        const response = await fetch(
            'http://localhost:8000/api/v1/users/register',
            {
                method: 'POST',
                headers: {
                    'accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    username,
                    password,
                    email
                })
            }
        )
        if (response.status !== 200){
            const data = await response.json();
            console.log(data)
            return false;
        }
        return true;
    }

    return (
        <div className="flex flex-col p-5 px-10 w-fit justify-center items-center bg-[#c0c0c025]
                rounded-md backdrop-blur-xs gap-5">
            <div>
                <h1>Log in</h1>
            </div>
            <input type="text" name="username" id="username"
                placeholder="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="outline-none rounded-md bg-[#00000015] p-2" />
            <input type="email" name="email" id="email"
                placeholder="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="outline-none rounded-md bg-[#00000015] p-2" />
            <input type="password" name="password" id="password"
                placeholder="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="outline-none rounded-md bg-[#00000015] p-2" />
            <input type="password" name="confirm-password" id="confirm-password"
                placeholder="confirm password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="outline-none rounded-md bg-[#00000015] p-2" />
            <div className="text-[#ffffff75] text-[12px] flex flex-start">
                <p>ALready registered?,</p><u className="cursor-pointer text-[#ffffff]"> login</u>
            </div>
            <div className="flex flex-row justify-around items-center p-2 w-full">
                <button className="cursor-pointer hover:bg-[#00000045] rounded-md duration-300 p-1"
                onClick={() => register(username,password,confirmPassword,email)}
                >Register</button>
                <button className="cursor-pointer hover:bg-[#00000045] rounded-md duration-300 p-1">Cancel</button>
            </div>
        </div>
    );
};

export default Register;