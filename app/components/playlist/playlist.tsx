import type { PlayList } from "~/types/playlist";
import SocialStats from "../socialcontrols/socialcontrols";
import { BiSolidPlaylist } from "react-icons/bi";

const PlayListItem = ({ name, img, author,songs }: PlayList) => {
    return (
        <div className="flex flex-col bg-[#ffffff15] backdrop-blur-xs w-55 p-2 px-4
            items-center rounded-md cursor-pointer hover:bg-[#00000015]
            duration-500 m-1">
            <h1 className="text-[20px]">{name}</h1>
            <img className="rounded-md" src={img} alt={`playlist-${name}`} />
            <h1 className="text-[15px]">{author}</h1>
            <div className="flex flex-row justify-around my-2 items-center">
                <BiSolidPlaylist size={20}/>
                <p>Tracks: <small>{songs.length}</small></p>
            </div>
            <SocialStats
            likes={9000}
            dislikes={9000000}
            reproductions={900}
            hearts={95500000}
            />
        </div>
    )
};

export default PlayListItem;