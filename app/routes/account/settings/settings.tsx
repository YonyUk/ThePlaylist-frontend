import { useState } from "react";
import EditableField from "~/components/editablefield/editablefield";

export default function Settings() {

    const [username,setUsername] = useState('');
    
    return (
        <div className="flex flex-col w-full h-full pt-20 items-center justify-center pl-18">
            <EditableField
            id="username"
            name="username"
            type="text"
            onEditCallback={setUsername}
            />
            <button onClick={() => console.log(username)}>Click</button>
        </div>
    );
}