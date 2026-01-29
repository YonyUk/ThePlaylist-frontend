import { Form, redirect, useLocation, useNavigate, useNavigation } from "react-router";
import type { Route } from "./+types/create_playlist";
import { useState } from "react";
import { UserService } from "~/services/UserService";
import { ROUTES } from "~/routes";
import { PlaylistService } from "~/services/PlaylistService";
import type { AxiosError, AxiosResponse } from "axios";
import type { NetworkError } from "~/types/responsetypes";

interface IntegrityError {
    error:string;
}

export async function clientLoader({ request }: Route.ClientLoaderArgs) {
    const service = UserService.get();

        const authenticated = await service.authenticated();
        if (!authenticated)
            return redirect(ROUTES.LOGIN);
}

export async function clientAction({ request }: Route.ClientActionArgs) {
    const service = PlaylistService.get();

    const formData = await request.formData();

    const name = formData.get("playlist-name");
    const description = formData.get("playlist-description");

    if (!(name && description))
        return null;

    const data = {
        name: String(name),
        description: String(description)
    };
    try {
        const existsResponse = await service.checkPlaylistName(String(name));
        if (existsResponse.status === 200 && existsResponse.data.result)
            return {
                error: `A playlist with name "${name}" already exists, your playlists must have unique names`
            };
        const response = await service.createPlaylist(data);
        if (response.status === 201)
            return redirect(`${ROUTES.MYPLAYLISTS}/${response.data.id}/modify`);
        return response;
    } catch (error) {
        return (error as AxiosError).response;
    }
}

export default function CreatePlaylist({ loaderData, actionData }: Route.ComponentProps) {

    const [playlistName, setPlaylistName] = useState("");
    const [description, setDescription] = useState("");

    const navigate = useNavigate();

    const pattern = /^[a-zA-Z0-9\s]+$/;

    const networkError = (actionData as any) as NetworkError;
    const integrityError = actionData as IntegrityError;
    const playlist = actionData as AxiosResponse;

    // console.log(integrityError);

    return (
        <Form
            method="post"
            className="flex flex-col h-9/10 justify-center items-center pl-10">
            <div className="flex flex-col p-4 
            rounded-md backdrop-blur-md bg-[#c0c0c025]
            py-10 justify-center items-center">
                <h1>New playlist</h1>
                {
                    integrityError &&
                    <div 
                    className="flex w-55 flex-col text-red-500 text-[10px] break-words justify-center items-start">
                        {integrityError.error}
                    </div>
                }
                {
                    networkError &&
                    <div 
                    className="flex w-55 flex-col text-red-500 text-[10px] break-words justify-center items-start">
                        {networkError.msg}
                    </div>
                }
                <input
                    onChange={(e) => setPlaylistName(e.target.value)}
                    value={playlistName}
                    className="outline-none bg-[#00000015] rounded-md p-1 my-3"
                    type="text" name="playlist-name" id="playlist-name" placeholder="playlist name" />
                <input type="text" name="playlist-description" hidden value={description} />
                <textarea
                    className="
                    resize-none overflow-y-auto 
                    transition-all duration-500

                    [&::-webkit-scrollbar]:w-2
                    [&::-webkit-scrollbar-track]:rounded-full
                    [&::-webkit-scrollbar-thumb]:bg-[#ffffff15]
                    [&::-webkit-scrollbar-thumb]:rounded-full
                    [&::-webkit-scrollbar-thumb:hover]:bg-[#ffffff35]
                    [&::-webkit-scrollbar-thumb:hover]:cursor-pointer

                    scrollbar-thin
                    scrollbar-thumb-gray-400
                    scrollbar-track-gray-100
                    scrollbar-track-rounded
                    scrollbar-thumb-rounded

                    h-3/10 w-full outline-none bg-[#00000015] p-1 rounded-md"
                    name="p-description" id="p-description" placeholder="description"
                    onChange={(e) => setDescription(e.target.value)}></textarea>
                <div className="flex flex-row justify-around w-full my-3">
                    <button
                        className={`
                        p-1 ${pattern.test(playlistName) && "hover:bg-[#00000035] cursor-pointer"} duration-500 rounded-md
                        `}
                        disabled={!pattern.test(playlistName)}
                        type="submit">Create</button>
                    <button
                    onClick={() => navigate(-1)}
                        className="p-1 hover:bg-[#00000035] duration-500 rounded-md cursor-pointer"
                    >Cancel</button>
                </div>
            </div>
        </Form>
    )
}