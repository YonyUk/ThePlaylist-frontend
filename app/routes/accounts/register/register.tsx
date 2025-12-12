import { Form } from "react-router";

const Register = () => {
    return (
        <Form
        method="post"
        className="flex flex-col p-5 px-10 w-fit justify-center items-center bg-[#c0c0c025]
                rounded-md backdrop-blur-xs gap-5">
            <div>
                <h1>Register</h1>
            </div>
            <input type="text" name="username" id="username"
                placeholder="username"
                className="outline-none rounded-md bg-[#00000015] p-2" />
            <input type="email" name="email" id="email"
                placeholder="email"
                className="outline-none rounded-md bg-[#00000015] p-2" />
            <input type="password" name="password" id="password"
                placeholder="password"
                className="outline-none rounded-md bg-[#00000015] p-2" />
            <input type="password" name="confirm-password" id="confirm-password"
                placeholder="confirm password"
                className="outline-none rounded-md bg-[#00000015] p-2" />
            <div className="text-[#ffffff75] text-[12px] flex flex-start">
                <p>ALready registered?,</p><u className="cursor-pointer text-[#ffffff]"> login</u>
            </div>
            <div className="flex flex-row justify-around items-center p-2 w-full">
                <button
                type="submit"
                className="cursor-pointer hover:bg-[#00000045] rounded-md duration-300 p-1"
                >Register</button>
                <button className="cursor-pointer hover:bg-[#00000045] rounded-md duration-300 p-1">Cancel</button>
            </div>
            
        </Form>
    )
};

export default Register;