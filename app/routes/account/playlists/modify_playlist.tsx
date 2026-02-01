import { redirect } from "react-router";
import type { Route } from "./+types/modify_playlist";
import { UserService } from "~/services/UserService";
import { ROUTES } from "~/routes";
import TrackUploader from "~/components/trackuploader/trackuploader";

export async function clientLoader({ params }: Route.ClientLoaderArgs) {
    const service = UserService.get();

    const authenticated = await service.authenticated();
    if (!authenticated)
        return redirect(ROUTES.LOGIN);
    const playlistId = params.playlistId;
    return playlistId;
}

export default function ModifyPlaylist({ loaderData }: Route.ComponentProps) {
    const playlistId = loaderData;

    return (
        <TrackUploader playlistId={playlistId} cloudAccess/>
    )
}