import { TrackService } from "~/services/TrackService";
import type { Route } from "./+types/mytracks";
import { UserService } from "~/services/UserService";
import { redirect } from "react-router";
import { ROUTES } from "~/routes";
import type { AxiosError } from "axios";
import SearchBar from "~/components/searchbar/searchbar";
import type { TrackDTO } from "~/dtos/trackdto";
import PlayListTrackItem from "~/components/playlist_track_item/playlist_track_item";
import { useState } from "react";
import ComboBox from "~/components/combobox/combobox";

export async function clientLoader({ params }: Route.ClientLoaderArgs) {
    const service = TrackService.get();
    const userService = UserService.get();

    const page = params.page;

    const authenticated = await userService.authenticated();
    if (!authenticated)
        return redirect(ROUTES.LOGIN);

    try {
        const response = await service.getMyTracks(parseInt(page));
        return response.data;
    } catch (error) {
        return (error as AxiosError).response?.data
    }
}

export default function MyTracks({ loaderData }: Route.ComponentProps) {

    const tracks = Array.from(loaderData as TrackDTO[]);
    const [playlistSelected, setPlaylistSelected] = useState("none");

    return (
        <div
            className="flex flex-col pl-18 w-full h-22/25 items-center gap-5 p-2 overflow-y-auto"
        >
            <SearchBar />
            <div className="flex flex-row h-full w-full gap-2">
                <div className="flex flex-col h-4/5 w-2/3 p-2 overflow-hidden rounded-md items-center bg-[#00000045]">
                    <h1>Tracks</h1>
                    {
                        tracks.map((trackItem, index) => (
                            <PlayListTrackItem track_id={trackItem.id} key={index} />
                        ))
                    }
                </div>
                <div className="flex flex-col h-4/5 w-1/3 p-2 overflow-hidden rounded-md justify-start items-center bg-[#00000045]">
                    <ComboBox
                    defaultValue="select a playlist"
                    width={140}
                    height={140}
                    options={["1","2","3"]}
                    onSelect={(value:string) => console.log(value)}
                    iconSize={10}
                    />
                    <h1>Tracks added</h1>
                </div>
            </div>
        </div>
    )
}