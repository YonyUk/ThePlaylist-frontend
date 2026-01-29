import { CgAdd } from "react-icons/cg";
import { getHeight, getWidth } from "~/utils/tools";

interface AddItemInput {
    width?: number;
    height?: number;
    text?: string;
    iconSize?: number;
}

export default function AddItem({ width, height, text, iconSize }: AddItemInput) {
    return (
        <div style={{
            width:width ?? 50,
            height:height ?? 65
        }}
        className={`flex flex-col justify-center items-center bg-[#ffffff15] backdrop-blur-xs p-2 px-4
            items-center rounded-md cursor-pointer hover:bg-[#00000015]
            duration-500 m-1 text-[#ffffff55]`}>
            <div>
                <CgAdd size={iconSize ?? 50} />
            </div>
            {text}
        </div>
    )
}