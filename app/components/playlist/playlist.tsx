import { useEffect, useState } from "react";
import SocialStats from "../socialstats/socialstats";
import { BiSolidPlaylist } from "react-icons/bi";
import { useNavigate } from "react-router";
import { ROUTES } from "~/routes";

interface PlayList {
    id: string
    name: string
    songs: number
    img?: string
    author: string
    reproductions?: number
    likes?: number
    dislikes?: number
    loves?: number
    toEditMode?: boolean
}

export default function PlayListItem({ name, img, toEditMode, author, songs, id, reproductions, dislikes, likes, loves }: PlayList) {

    const [plays, setPlays] = useState(reproductions ?? 0);
    const [_likes, setLikes] = useState(likes ?? 0);
    const [_dislikes, setDislikes] = useState(dislikes ?? 0);
    const [_loves, setLoves] = useState(loves ?? 0);

    useEffect(() => {
        setPlays(reproductions ?? 0);
        setLikes(likes ?? 0);
        setDislikes(dislikes ?? 0);
        setLoves(loves ?? 0);
    }, [reproductions, likes, dislikes, loves]);

    const navigate = useNavigate();

    return (
        <div className="flex flex-col bg-[#ffffff15] backdrop-blur-xs w-55 p-2 px-4
            items-center rounded-md cursor-pointer hover:bg-[#00000015]
            duration-500 m-1" onClick={(e) => navigate(
            toEditMode ? `${ROUTES.MYPLAYLISTS}/${id}/modify` : `${ROUTES.PLAYLISTS}/${id}`,
            { state: { edit: toEditMode === true } }
        )}>
            <h1 className="text-[20px]">{name}</h1>
            {img && <img className="rounded-md" src={img} alt={`playlist-${name}`} />}
            {!img && <h3 className="flex justify-center items-center rounded-md bg-[#00000050] w-50 h-30">No image</h3>}
            <h1 className="text-[15px]">{author}</h1>
            <div className="flex flex-row justify-around my-2 items-center">
                <BiSolidPlaylist size={20} />
                <p>Tracks: <small>{songs}</small></p>
            </div>
            <SocialStats
                likes={_likes}
                dislikes={_dislikes}
                reproductions={plays}
                hearts={_loves}
            />
        </div>
    )
};