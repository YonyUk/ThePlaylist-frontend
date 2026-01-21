import { TrackService } from "~/services/TrackService";
import { UserService } from "~/services/UserService";
import { redirect } from "react-router";
import { ROUTES } from "~/routes";
import type { AxiosError } from "axios";
import SearchBar from "~/components/searchbar/searchbar";
import type { TrackDTO } from "~/dtos/trackdto";
import PlayListTrackItem from "~/components/playlist_track_item/playlist_track_item";
import { useState } from "react";
import type { PlaylistDTO } from "~/dtos/playlistdto";
import { PlaylistService } from "~/services/PlaylistService";
import type { Route } from "./+types/add_tracks_from_cloud";

interface MyTracksLoaderData {
    tracks: TrackDTO[];
    playlists: PlaylistDTO[]
}

export async function clientLoader({ params }: Route.ClientLoaderArgs) {
    const service = TrackService.get();
    const playlistService = PlaylistService.get();
    const userService = UserService.get();

    const page = params.page;

    const authenticated = await userService.authenticated();
    if (!authenticated)
        return redirect(ROUTES.LOGIN);

    try {
        const tracksResponse = await service.getMyTracks(parseInt(page));
        const playlistsResponse = await playlistService.getMyPlaylists(parseInt(page));
        return {
            tracks: tracksResponse.data,
            playlists: playlistsResponse.data
        } as MyTracksLoaderData;
    } catch (error) {
        return (error as AxiosError).response?.data
    }
}

export default function AddTracksFromCloud({ loaderData }: Route.ComponentProps) {

    const data = (loaderData as MyTracksLoaderData);
    const tracks = data.tracks;
    const playlists = data.playlists;

    const [playlistSelected, setPlaylistSelected] = useState("none");

    return (
        <div
            className="flex flex-col pl-18 w-full h-22/25 items-center gap-5 p-2 overflow-y-auto"
        >
            <SearchBar />
            <div className="flex flex-row h-full w-full gap-2">
                <div className="flex flex-col h-4/5 w-full p-2 overflow-hidden rounded-md items-center bg-[#00000045]">
                    <h1>Tracks</h1>
                    {
                        tracks.map((trackItem, index) => (
                            <PlayListTrackItem track_id={trackItem.id} key={index} />
                        ))
                    }
                </div>
                <div className="flex flex-col h-4/5 w-1/3 p-2 overflow-hidden rounded-md justify-start items-center bg-[#00000045]">
                    <h1>Tracks added</h1>
                </div>
            </div>
        </div>
    )
}