import { useEffect, useState } from "react";
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
    const [validField,setValidField] = useState(valid !== undefined ? valid : true);

    useEffect(() => {
        setValidField(valid !== undefined ? valid : true);
    },[valid]);

    return (
        <>
            {
                !validField &&
                <p
                    className="text-red-500 text-[10px] rounded-md">
                    {invalidDescription}
                </p>
            }
            <div className="flex flex-row gap-5 p-2">
                <input type={type} name={name} id={id}
                    placeholder={name}
                    className={`outline-none color-white  rounded-md bg-[#00000035] p-2 ${!valid && "border-[1px] border-red-500"}`}
                    value={fieldValue}
                    disabled={!editing}
                    onChange={(e) => {
                        onEditCallback(e.target.value);
                        setFieldValue(e.target.value);
                    }}
                />
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
        </>
    );
}