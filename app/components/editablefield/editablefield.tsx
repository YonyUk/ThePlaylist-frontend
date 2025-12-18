import { useState } from "react";
import { MdEdit, MdDone } from "react-icons/md";

interface EditableFieldComponentInput {
    type: 'text' | 'password' | 'email';
    name: string;
    id: string;
    value?: string;
    valid?: boolean;
    invalidDescription?: string;
    onEditCallback: (value: string | ((prevState: string) => string)) => void;
    onEditEnd: () => void;
}

export default function EditableField({ invalidDescription, valid, value, id, name, type, onEditCallback, onEditEnd }: EditableFieldComponentInput) {

    const [fieldValue, setFieldValue] = useState(value);
    const [editing, setEditing] = useState(false);
    const validField = valid !== undefined ? valid : true;

    return (
        <div className="flex flex-row gap-5 p-2 relative">
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
                !validField &&
                <p
                    className="absolute text-red-500 text-[10px] -top-[1px] backdrop-blur-xs rounded-md ml-1">
                    {invalidDescription}
                </p>
            }
            {
                !editing && type !== 'password' &&
                <p className={`
                    p-2 w-59 rounded-md bg-[#00000035] ${!validField && "border-[1px] border-red-500 rounded-md"}`
                }>{fieldValue ? fieldValue : name}</p>
            }
            {
                !editing && type === 'password' &&
                <input type={type} name={name} id={id} 
                className="outline-none color-white  rounded-md bg-[#00000035] p-2"
                value={fieldValue}
                disabled={true}
                />
            }
            <div
                onClick={() => {
                    if (editing)
                        onEditEnd();
                    setEditing(!editing)
                }}
                className="flex justify-center items-center cursor-pointer bg-[#00000035] hover:bg-[#00000050] duration-300 p-1 px-2 rounded-md">
                {
                    editing ? <MdDone size={20} /> : <MdEdit size={20} />
                }
            </div>
        </div>
    );
}