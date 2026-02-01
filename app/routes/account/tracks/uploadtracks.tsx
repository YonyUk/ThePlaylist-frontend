import { UserService } from "~/services/UserService";
import type { Route } from "./+types/uploadtracks";
import { redirect } from "react-router";
import { ROUTES } from "~/routes";
import TrackUploader from "~/components/trackuploader/trackuploader";

export async function clientLoader({ }: Route.ClientLoaderArgs) {
    const service = UserService.get();

    const authenticated = service.authenticated();

    if (!authenticated)
        return redirect(ROUTES.LOGIN);
}

export default function UploadTracks({ loaderData }: Route.ComponentProps) {
    return (
        <TrackUploader/>
    )
}