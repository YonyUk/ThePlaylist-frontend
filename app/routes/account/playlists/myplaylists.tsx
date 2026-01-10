import { UserService } from "~/services/UserService";
import type { Route } from "./+types/myplaylists";
import { redirect } from "react-router";
import { ROUTES } from "~/routes";
import type { PlaylistDTO } from "~/dtos/playlistdto";
import PlayListItem from "~/components/playlist/playlist";

export async function clientLoader({ params }: Route.ClientLoaderArgs) {
    const page = parseInt(params.page);
    const service = UserService.get();
    try {
        const authenticated = await service.authenticated();
        if (authenticated) {
            const response = await service.getInfo();
            const user_id = response.data.id;
            const playlists_response = await service.userPlaylists(user_id,page,10);
            return playlists_response.data;
        }
        return redirect(ROUTES.LOGIN);
    } catch (error) {
        return null;
    }
}

export default function MyPlaylists({actionData,loaderData}:Route.ComponentProps) {

    const playlists = (loaderData as PlaylistDTO[]);    

    return (
        <div className="flex flex-end rounded-md bg-[#00000045] p-4 pl-18">
            { loaderData && playlists.map((playlist,index) => {
                return (
                    <PlayListItem
                    key={index}
                    id={playlist.id}
                    name={playlist.name}
                    author={playlist.author}
                    songs={playlist.tracks.length}
                    toEditMode={true}
                    />
                )
            })}
        </div>
    )
}