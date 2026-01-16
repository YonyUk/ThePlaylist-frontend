import { CgAdd } from "react-icons/cg";

interface AddItemInput {
    width?: number;
    height?: number;
    text?: string
}

export default function AddItem({ width, height, text }: AddItemInput) {
    return (
        <div className={`flex flex-col justify-center items-center bg-[#ffffff15] backdrop-blur-xs p-2 px-4
            items-center rounded-md cursor-pointer hover:bg-[#00000015]
            duration-500 m-1 text-[#ffffff55] w-${width} h-${height}`}>
                <div>
                    <CgAdd size={50}/>
                </div>
            {text}
        </div>
    )
}