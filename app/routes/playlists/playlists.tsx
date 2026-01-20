import { useState } from "react";
import PlayListItem from "~/components/playlist/playlist";
import SearchBar from "~/components/searchbar/searchbar";
import type { Route } from "./+types/playlists";
import { redirect } from "react-router";
import { ROUTES } from "~/routes";
import { UserService } from "~/services/UserService";
import type { PlaylistDTO } from "~/dtos/playlistdto";
import { PlaylistService } from "~/services/PlaylistService";
import type { AxiosError } from "axios";
import type { NetworkError } from "~/types/responsetypes";

export async function clientLoader({ params }: Route.ClientLoaderArgs) {
    const service = UserService.get();
    const playlistService = PlaylistService.get();

    if (!service.authenticated())
        return redirect(ROUTES.LOGIN);

    try {
        const response = await playlistService.getPlaylists();
        return response.data;
    } catch (error) {
        return (error as AxiosError);
    }
}

export default function PlayLists({ loaderData }: Route.ComponentProps) {

    const playlists = Array.from(loaderData as PlaylistDTO[]);
    const error = (loaderData as AxiosError);

    const error_msg = ((error.response?.data as any) as NetworkError);

    return (
        <div className="p-3 pl-18 gap-5 flex flex-col h-screen w-full items-center">
            <SearchBar />
            <div className={`flex ${playlists.length !== 0 ?
                'flex-wrap bg-[#00000045] w-full px-5 py-2 overflow-auto' :
                'flex-col h-full justify-center'}
                rounded-md justify-items-start`}>
                {
                    playlists.length === 0 &&
                    <div className='bg-[#00000045] rounded-md p-10 flex flex-col self-center
                        justify-self-center justify-center items-center'>
                        <h1 className="text-[30px]">No playlists</h1>
                        <h3 className="text-red-500 text-[15px]">{error_msg.msg}</h3>
                    </div>
                }
                {
                    playlists.length > 0 &&
                    playlists.map((item, index) => {
                        return (
                            <PlayListItem
                                key={index}
                                id={item.id}
                                name={item.name}
                                songs={item.tracks.length}
                                author={item.author}
                                reproductions={item.plays}
                            />
                        )
                    })
                }
            </div>
        </div>
    )

};