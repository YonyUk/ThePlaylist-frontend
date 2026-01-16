import SocialStats from "../socialstats/socialstats";
import { useGetTrackInfo } from "~/hooks/track";
import { AiOutlineLoading3Quarters } from "react-icons/ai";

interface PlayListTrackItemInput {
    track_id: string;
}

export default function PlayListTrackItem({ track_id }: PlayListTrackItemInput) {
    const track = useGetTrackInfo(track_id);

    return (
        <>
            {
                !track &&
                <div style={{
                    animation: "loadingAnimation 1.5s linear infinite"
                }}>
                    < AiOutlineLoading3Quarters size={10} />
                </div>
            }
            {
                track &&
                <div className="flex w-full flex-col justify-center items-center backdrop-blur-xs rounded-md bg-[#ffffff15] p-2 my-1">
                    <div className="flex flex-row justify-start items-center w-full">
                        <h1 className="text-[15px]">{track.name.substring(0, track.name.lastIndexOf('.'))}</h1>
                        <h3 className="text-[10px] mt-1 ml-2 text-[#ffffff75]">{track.author_name}</h3>
                    </div>
                    <SocialStats
                        likes={track.likes}
                        dislikes={track.dislikes}
                        hearts={track.loves}
                        reproductions={track.plays}
                    />
                </div>
            }
        </>
    )
}