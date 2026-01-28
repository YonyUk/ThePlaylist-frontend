import { CgAdd } from "react-icons/cg";

interface AddItemInput {
    width?: number | "full" | "fit";
    height?: number | "full" | "fit";
    text?: string;
    iconSize?: number;
}

const getWidth = (width?: number | "full" | "fit") => {
    if (width) {
        switch (width) {
            case "full":
                return "w-full";

            case "fit":
                return "w-fit";

            default:
                return `w-[${width}px]`;
        }
    }
    return '';
}

const getHeight = (height?: number | "full" | "fit") => {
    if (height) {
        switch (height) {
            case "full":
                return "h-full";

            case "fit":
                return "h-fit";

            default:
                return `h-[${height}px]`;
        }
    }
    return '';
}

export default function AddItem({ width, height, text, iconSize }: AddItemInput) {
    return (
        <div className={`flex flex-col justify-center items-center bg-[#ffffff15] backdrop-blur-xs p-2 px-4
            items-center rounded-md cursor-pointer hover:bg-[#00000015]
            duration-500 m-1 text-[#ffffff55] ${getWidth(width)} ${getHeight(height)}`}>
            <div>
                <CgAdd size={iconSize ?? 50} />
            </div>
            {text}
        </div>
    )
}