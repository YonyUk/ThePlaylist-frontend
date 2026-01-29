import { UserService } from "~/services/UserService";
import type { Route } from "./+types/myplaylists";
import { redirect, useNavigate } from "react-router";
import { ROUTES } from "~/routes";
import type { PlaylistDTO } from "~/dtos/playlistdto";
import PlayListItem from "~/components/playlist/playlist";
import AddItem from "~/components/add_item/add_item";
import PageController from "~/components/pagecontroller/pagecontroller";
import { useState } from "react";
import { PlaylistService } from "~/services/PlaylistService";

interface LoaderDataResult {
    playlists: PlaylistDTO[];
    nextPage: boolean;
}

export async function clientLoader({ params }: Route.ClientLoaderArgs) {
    const page = parseInt(params.page);
    const service = UserService.get();
    try {
        const authenticated = await service.authenticated();
        if (authenticated) {
            const playlists_response = await service.myPlaylists(page, 10);
            const nextResponse = await service.myPlaylists(page + 1, 10);
            return {
                playlists: playlists_response.data,
                nextPage: nextResponse.data.length !== 0
            } as LoaderDataResult
        }
        return redirect(ROUTES.LOGIN);
    } catch (error) {
        return null;
    }
}

export default function MyPlaylists({ actionData, loaderData, params }: Route.ComponentProps) {
    const service = UserService.get();
    const [currentPage, setCurrentPage] = useState(parseInt(params.page));
    const [playlists, setPlaylists] = useState((loaderData as LoaderDataResult).playlists);
    const [nextPage, setNextPage] = useState((loaderData as LoaderDataResult).nextPage);
    const itemsContainerWidth = 210;
    const itemsContainerHeight = 200;

    const navigate = useNavigate();

    const handleNext = async () => {
        const response = await service.myPlaylists(currentPage + 1, 10);
        const nextResponse = await service.myPlaylists(currentPage + 2, 10);
        if (response.status === 200){
            setPlaylists(response.data);
            setCurrentPage(currentPage + 1);
        }
        if (nextResponse.status === 200)
            setNextPage(nextResponse.data.length !== 0);
    }

    const handlePrev = async () => {
        const response = await service.myPlaylists(currentPage - 1, 10);
        if (response.status === 200)
            setPlaylists(response.data);
        setNextPage(true);
        setCurrentPage(currentPage - 1);
    }

    return (
        <div className="flex flex-end flex-wrap rounded-md bg-[#00000045] p-4 pl-18">
            {loaderData && playlists.map((playlist, index) => {
                return (
                    <PlayListItem
                        width={itemsContainerWidth}
                        height={itemsContainerHeight}
                        key={index}
                        id={playlist.id}
                        name={playlist.name}
                        author={playlist.author}
                        songs={playlist.tracks.length}
                        toEditMode={true}
                    />
                )
            })}
            <div className="flex flex-1" onClick={() => navigate(ROUTES.CREATEPLAYLIST)}>
                <AddItem
                    width={itemsContainerWidth}
                    height={itemsContainerHeight}
                    text="Add new playlist" />
            </div>
            <div className="flex w-full fixed justify-center items-center bottom-5">
                <PageController
                    nextPage={nextPage}
                    currentPage={currentPage}
                    onNext={() => handleNext()}
                    onPrev={() => handlePrev()}
                />
            </div>
        </div>
    )
}