import { AiOutlineLoading3Quarters } from "react-icons/ai";

interface TrackLoadingInput {
    width?: number;
    height?: number;
    iconSize?: number;
}

export default function TrackLoading({ width, height, iconSize }: TrackLoadingInput) {
    return (
        <div style={{
            width:width ?? 50,
            height:height ?? 65
        }}
        className={`flex justify-center items-center bg-[#00000045] rounded-md`}>
            <div style={{
                animation: "loadingAnimation 1.5s linear infinite",
            }}>
                < AiOutlineLoading3Quarters size={iconSize ?? 50} />
            </div>
        </div>
    )
}