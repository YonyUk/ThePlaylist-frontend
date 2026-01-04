import SearchBar from "~/components/searchbar/searchbar";
import type { Route } from "./+types/playlistview";
import { useCallback, useEffect, useState } from "react";
import CurrentSong from "~/components/currentsong/currentsong";
import SongBar from "~/components/songbar/songbar";
import { PlaylistService } from "~/services/PlaylistService";
import type { AxiosError } from "axios";
import { TrackService } from "~/services/TrackService";
import type { PlaylistDTO } from "~/dtos/playlistdto";
import { useGetTrack } from "~/hooks/track";

export async function clientLoader({ params }: Route.ClientLoaderArgs) {
    const playlist_id = params.playlistId;
    const service = PlaylistService.get();

    try {
        const response = await service.getPlaylist(playlist_id);
        return response.data;
    } catch (error) {
        return (error as AxiosError).response?.data;
    }
}

export default function PlayListView({ loaderData }: Route.ComponentProps) {
    const service = TrackService.get();

    const tracks = (loaderData as PlaylistDTO)?.tracks;
    const [currentTrack, setCurrentTrack] = useState(tracks[0]);

    const { loading, track } = useGetTrack(((loaderData as PlaylistDTO).tracks[0].id))
    console.log(loading, track);

    return (
        <div className="flex flex-col pl-18 w-full h-screen items-center gap-5 p-2 overflow-auto">
            <SearchBar />
            {
                track &&
                <CurrentSong
                    name={currentTrack.name}
                    id={currentTrack.id}
                    author_name={currentTrack.author_name}
                    likes={currentTrack.likes}
                    dislikes={currentTrack.dislikes}
                    loves={currentTrack.loves}
                />
            }
            <SongBar />
            <div className="flex flex-col h-fit w-fit px-5 overflow-auto rounded-md items-center">

            </div>
        </div>
    )
};