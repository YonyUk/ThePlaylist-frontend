import { AiOutlineLoading3Quarters } from "react-icons/ai";

export default function TrackLoading() {
    return (
        <div className="flex w-50 h-65 justify-center items-center bg-[#00000045] rounded-md">
            <div style={{
                animation: "loadingAnimation 1.5s linear infinite"
            }}>
                < AiOutlineLoading3Quarters size={50} />
            </div>
        </div>
    )
}