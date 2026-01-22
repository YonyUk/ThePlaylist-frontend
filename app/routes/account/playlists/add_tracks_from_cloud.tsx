import { TrackService } from "~/services/TrackService";
import { UserService } from "~/services/UserService";
import { redirect } from "react-router";
import { ROUTES } from "~/routes";
import type { AxiosError } from "axios";
import SearchBar from "~/components/searchbar/searchbar";
import PlayListTrackItem from "~/components/playlist_track_item/playlist_track_item";
import type { Route } from "./+types/add_tracks_from_cloud";
import type { TrackDTO } from "~/dtos/trackdto";
import { PlaylistService } from "~/services/PlaylistService";
import { useGetTracks } from "~/hooks/track";
import { useState } from "react";

interface MyLoadedData {
    tracks: TrackDTO[];
    playlistId: string;
    page:number;
}

export async function clientLoader({ params }: Route.ClientLoaderArgs) {
    const service = TrackService.get();
    const userService = UserService.get();

    const page = params.page;
    const id = params.playlistId;

    const authenticated = await userService.authenticated();
    if (!authenticated)
        return redirect(ROUTES.LOGIN);

    try {
        const tracksResponse = await service.getMyTracks(parseInt(page));
        return {
            tracks: tracksResponse.data,
            playlistId: id,
            page:parseInt(page)
        } as MyLoadedData;
    } catch (error) {
        return (error as AxiosError).response?.data
    }
}

export default function AddTracksFromCloud({ loaderData }: Route.ComponentProps) {

    const service = PlaylistService.get();
    const data = loaderData as MyLoadedData;
    const userTracks = data.tracks;
    const playlistId = data.playlistId;
    const [currentPage,setCurrentPage] = useState(data.page);

    const {
        tracks,
        setPage,
        setPlaylistId
    } = useGetTracks(0,playlistId);

    const addTrackToPlaylist = async (trackId: string) => {
        const response = await service.addTrackToPlaylist(playlistId, trackId);
    }

    return (
        <div
            className="flex flex-col pl-18 w-full h-22/25 items-center gap-5 p-2 overflow-y-auto"
        >
            <SearchBar />
            <div className="flex flex-row h-full w-full gap-2">
                <div className="flex flex-col h-4/5 w-full p-2 overflow-hidden rounded-md items-center bg-[#00000045]">
                    <h1>Tracks</h1>
                    {
                        userTracks.map((trackItem, index) => (
                            <PlayListTrackItem
                                track_id={trackItem.id}
                                key={index}
                                dashboardControls={true}
                                onAddClicked={addTrackToPlaylist}
                            />
                        ))
                    }
                </div>
                <div className="flex flex-col h-4/5 w-1/3 p-2 overflow-hidden rounded-md justify-start items-center bg-[#00000045]">
                    <h1>Tracks added</h1>
                    {
                        tracks.map((track,index) => (
                            <h1 key={index}>{track.name.substring(0,track.name.lastIndexOf('.'))}</h1>
                        ))
                    }
                </div>
            </div>
        </div>
    )
}