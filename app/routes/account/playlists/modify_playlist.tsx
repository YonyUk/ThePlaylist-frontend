import { redirect, useActionData, useNavigate } from "react-router";
import { useCallback, useRef, useState } from "react";
import AddItem from "~/components/add_item/add_item";
import { TrackService } from "~/services/TrackService";
import { PlaylistService } from "~/services/PlaylistService";
import type { Route } from "./+types/modify_playlist";
import { UserService } from "~/services/UserService";
import { ROUTES } from "~/routes";
import { TrackToUpload, type TrackToUploadRef } from "~/components/track_to_upload/track_to_upload";
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
    const trackService = TrackService.get();
    const playlistService = PlaylistService.get();

    const playlistId = loaderData;

    return (
        <TrackUploader playlistId={playlistId}/>
    )
}