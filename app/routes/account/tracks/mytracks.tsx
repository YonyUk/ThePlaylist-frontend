import { TrackService } from "~/services/TrackService";
import type { Route } from "./+types/mytracks";
import { UserService } from "~/services/UserService";
import { redirect } from "react-router";
import { ROUTES } from "~/routes";
import type { AxiosError } from "axios";
import SearchBar from "~/components/searchbar/searchbar";
import type { TrackDTO } from "~/dtos/trackdto";
import PlayListTrackItem from "~/components/playlist_track_item/playlist_track_item";

export async function clientLoader({ params }: Route.ClientLoaderArgs) {
    const service = TrackService.get();
    const userService = UserService.get();

    const page = params.page;

    const authenticated = userService.authenticated();
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

    return (
        <div
            className="flex flex-col pl-18 w-full h-22/25 items-center gap-5 p-2 overflow-y-auto"
        >
            <SearchBar />
            <div className="flex flex-col h-4/5 w-full p-2 overflow-hidden rounded-md items-center bg-[#00000045]">
                {
                    tracks.map((trackItem, index) => (
                        <PlayListTrackItem track_id={trackItem.id} key={index} />
                    ))
                }
            </div>
        </div>
    )
}