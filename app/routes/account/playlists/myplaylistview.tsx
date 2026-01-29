import PlayListTrackItem from "~/components/playlist_track_item/playlist_track_item";
import SearchBar from "~/components/searchbar/searchbar";
import type { Route } from "../../playlistview/+types/playlistview";
import { PlaylistService } from "~/services/PlaylistService";
import { UserService } from "~/services/UserService";
import { ROUTES } from "~/routes";
import { redirect, useNavigate } from "react-router";
import type { AxiosError } from "axios";
import type { PlaylistDTO } from "~/dtos/playlistdto";
import { TrackService } from "~/services/TrackService";
import { useState } from "react";
import type { TrackDTO } from "~/dtos/trackdto";
import { RiDeleteBin6Line } from "react-icons/ri";
import { AiOutlineLoading3Quarters } from "react-icons/ai";

export async function clientLoader({ params }: Route.ClientLoaderArgs) {
    const playlist_id = params.playlistId;
    const service = PlaylistService.get();
    const userService = UserService.get();

    try {
        const authenticated = await userService.authenticated();
        if (!authenticated)
            return redirect(ROUTES.LOGIN);
    } catch (error) {
        return redirect(ROUTES.LOGIN);
    }

    try {
        const response = await service.getPlaylist(playlist_id);
        return response.data;
    } catch (error) {
        return (error as AxiosError).response?.data;
    }
}

export default function MyPlaylistView({ loaderData }: Route.ComponentProps) {
    const service = TrackService.get();
    const playlistService = PlaylistService.get();
    const [tracks, setTracks] = useState<TrackDTO[]>((loaderData as PlaylistDTO).tracks);
    const playlistName = (loaderData as PlaylistDTO).name;
    const playlistId = (loaderData as PlaylistDTO).id;
    const [deleting, setDeleting] = useState(false);

    const navigate = useNavigate();

    const removeTrack = async (trackId: string) => {
        setDeleting(true);
        const response = await service.removeTrack(trackId);
        if (response.status === 202)
            setTracks(tracks.filter((track, _) => track.id != trackId));
        setDeleting(false);
    }

    const removePlaylist = async () => {
        const response = await playlistService.removePlaylist(playlistId);
        if (response.status === 202)
            navigate(`${ROUTES.MYPLAYLISTS}/0`);
    }

    return (
        <div className="flex flex-col pl-18 w-full h-9/10 items-center gap-5 p-2 overflow-y-auto">
            <div className="flex rounded-md text-[30px] justify-center items-center p-1 w-full bg-[#00000045]">
                {playlistName}
            </div>
            <hr className="flex w-full" />
            <SearchBar />
            <div className="flex flex-col h-full w-full px-5 overflow-hidden rounded-md items-center">
                {
                    tracks.map((trackItem, index) => (
                        <PlayListTrackItem track_id={trackItem.id} key={index}
                            dispensable onRemoveClicked={(trackId: string) => removeTrack(trackId)} />
                    ))
                }
            </div>
            <div className="flex flex-row justify-end w-full p-1 px-4 pb-3">
                <button
                onClick={() => removePlaylist()}
                className="px-5 rounded-md bg-[#ffffff15] p-2 hover:bg-[#00000045] duration-500 cursor-pointer">
                    <div style={{
                        animation: deleting ? "loadingAnimation 1.5s linear infinite" : ''
                    }}>
                        {
                            deleting &&
                            <AiOutlineLoading3Quarters size={20} />
                        }
                        {
                            !deleting &&
                            <RiDeleteBin6Line size={20} />
                        }
                    </div>
                </button>
            </div>
        </div>
    )
}