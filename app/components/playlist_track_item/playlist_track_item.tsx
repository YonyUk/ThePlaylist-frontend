import SocialStats from "../socialstats/socialstats";
import { useGetTrackInfo } from "~/hooks/track";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { MdOutlinePlaylistAdd } from "react-icons/md";

interface PlayListTrackItemInput {
    track_id: string;
    draggable?: boolean;
    dashboardControls?: boolean;
    onAddClicked?:(trackId:string) => void;
}

export default function PlayListTrackItem({ track_id, dashboardControls, draggable, onAddClicked }: PlayListTrackItemInput) {
    const track = useGetTrackInfo(track_id);
    const withDashboardControls = dashboardControls ?? false;
    const isDraggable = draggable ?? false;

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
                    {
                        withDashboardControls &&
                        <div className="flex flex-row w-full justify-bettwen items-center">
                            <SocialStats
                                likes={track.likes}
                                dislikes={track.dislikes}
                                hearts={track.loves}
                                reproductions={track.plays}
                            />
                            <div className="cursor-pointer p-1 rounded-md duration-500 hover:bg-[#00000045]"
                            onClick={() => {
                                if (onAddClicked)
                                    onAddClicked(track_id);
                            }}>
                                <MdOutlinePlaylistAdd size={20}/>
                            </div>
                        </div>
                    }
                    {
                        !withDashboardControls &&
                        <SocialStats
                            likes={track.likes}
                            dislikes={track.dislikes}
                            hearts={track.loves}
                            reproductions={track.plays}
                        />
                    }
                </div>
            }
        </>
    )
}