import { useState } from "react";
import { MdEdit, MdDone } from "react-icons/md";

interface EditableFieldComponentInput {
    type: 'text' | 'password' | 'email';
    name: string;
    id: string;
    value?: string;
    onEditCallback: (value: string | ((prevState: string) => string)) => void;
}

export default function EditableField({ value, id, name, type, onEditCallback }: EditableFieldComponentInput) {

    const [fieldValue,setFieldValue] = useState(value);
    const [editing, setEditing] = useState(false);

    return (
        <div className="flex flex-row gap-5 p-2">
            {
                editing &&
                <input type={type} name={name} id={id}
                    placeholder={name}
                    className="outline-none color-white  rounded-md bg-[#00000035] p-2"
                    value={fieldValue}
                    onChange={(e) => {
                        onEditCallback(e.target.value);
                        setFieldValue(e.target.value);
                    }}
                />
            }
            {
                !editing &&
                <p className="p-2 w-59 rounded-md bg-[#00000035]">{fieldValue ? fieldValue : name}</p>
            }
            <div 
            onClick={() => setEditing(!editing)}
            className="flex justify-center items-center cursor-pointer bg-[#00000035] hover:bg-[#00000050] duration-300 p-1 px-2 rounded-md">
                {
                    editing ? <MdDone size={20} /> : <MdEdit size={20} />
                }
            </div>
        </div>
    );
}