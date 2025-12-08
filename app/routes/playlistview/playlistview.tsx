import SearchBar from "~/components/searchbar/searchbar";
import SideBar from "~/components/sidebar/sidebar";
import type { Route } from "./+types/playlistview";
import { useState } from "react";
import type { Song } from "~/types/song";
import CurrentSong from "~/components/currentsong/currentsong";
import SongBar from "~/components/songbar/songbar";

const PlayListView = ({ params }: Route.ComponentProps) => {

    const songId = 'nada';
    const name = 'nadanadanadanadanada';
    const author = 'nadanadanadanadanadanadan';
    const src = 'nada';

    const song: Song = {
        id: songId,
        name,
        author,
        src
    };

    const [songs, setSongs] = useState<Song[]>([song]);
    const [currentSong, setCurrentSong] = useState<Song>(songs[0]);

    return (
        <div className="flex flex-col pl-18 w-full h-screen items-center gap-5 p-2 overflow-auto">
            <SideBar />
            <SearchBar />
            <CurrentSong
                name={currentSong.name}
                id={currentSong.id}
                author={currentSong.author}
                src={currentSong.src}
            />
            <SongBar/>
            <div className="flex flex-col h-fit w-fit px-5 overflow-auto rounded-md items-center">
            
            </div>
        </div>
    )
};

export default PlayListView;