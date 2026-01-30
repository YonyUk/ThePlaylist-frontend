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
import PageController from "~/components/pagecontroller/pagecontroller";

interface LoaderDataResult {
    playlists: PlaylistDTO[];
    nextPage: boolean;
}

export async function clientLoader({ params }: Route.ClientLoaderArgs) {
    const service = UserService.get();
    const playlistService = PlaylistService.get();
    const page = parseInt(params.page);

    if (!service.authenticated())
        return redirect(ROUTES.LOGIN);

    try {
        const response = await playlistService.getPlaylists(page);
        const nextResponse = await playlistService.getPlaylists(page + 1);
        return {
            playlists: response.data,
            nextPage: nextResponse.data.length !== 0
        } as LoaderDataResult
    } catch (error) {
        return (error as AxiosError);
    }
}

export default function PlayLists({ loaderData, params }: Route.ComponentProps) {
    const service = PlaylistService.get();

    const [playlists, setPlaylists] = useState(Array.from((loaderData as LoaderDataResult).playlists));
    const [nextPage, setNextPage] = useState((loaderData as LoaderDataResult).nextPage);
    const [currentPage, setCurrentPage] = useState(parseInt(params.page));
    const error = (loaderData as AxiosError);
    const [isSearching, setIsSearching] = useState(false);
    const [currentPattern, setCurrentPattern] = useState('');
    const itemsContainerWidth = 210;
    const itemsContainerHeight = 200;

    const error_msg = ((error.response?.data as any) as NetworkError);

    const handlePrev = async () => {
        const response = isSearching ?
            await service.searchPlaylists(currentPattern, currentPage - 1) :
            await service.getPlaylists(currentPage - 1);
        setCurrentPage(currentPage - 1);
        setNextPage(true);
        if (response.status === 200)
            setPlaylists(response.data);
    }

    const handleNext = async () => {
        const response = isSearching ?
            await service.searchPlaylists(currentPattern, currentPage + 1) :
            await service.getPlaylists(currentPage + 1);
        const nextResponse = isSearching ?
            await service.searchPlaylists(currentPattern, currentPage + 2) :
            await service.getPlaylists(currentPage + 2);
        if (response.status === 200) {
            setCurrentPage(currentPage + 1);
            setPlaylists(response.data);
        }
        if (nextResponse.status === 200)
            setNextPage(nextResponse.data.length !== 0)
    }

    const searchPlaylists = async (pattern: string) => {
        const response = await service.searchPlaylists(pattern, isSearching ? 0 : currentPage);
        setCurrentPattern(pattern);
        setIsSearching(pattern.length !== 0)
        if (response.status === 200)
            setPlaylists(response.data);
    }

    return (
        <div className="p-3 pl-18 gap-5 flex flex-col h-screen w-full items-center">
            <SearchBar onSearchClick={(value: string) => searchPlaylists(value)} />
            <div className={`flex ${playlists.length !== 0 ?
                'flex-wrap bg-[#00000045] w-full px-5 py-2 overflow-auto' :
                'flex-col h-full justify-center'}
                rounded-md justify-items-start`}>
                {
                    playlists.length === 0 &&
                    <div className='bg-[#00000045] rounded-md p-10 flex flex-col self-center
                        justify-self-center justify-center items-center'>
                        {
                            !error_msg &&
                            <h1 className="text-[30px]">No playlists</h1>
                        }
                        {
                            error_msg &&
                            <h3 className="text-red-500 text-[15px]">{error_msg.msg}</h3>
                        }
                    </div>
                }
                {
                    playlists.length > 0 &&
                    playlists.map((item, index) => {
                        return (
                            <PlayListItem
                                width={itemsContainerWidth}
                                height={itemsContainerHeight}
                                key={index}
                                id={item.id}
                                name={item.name}
                                songs={item.tracks.length}
                                author={item.author}
                                reproductions={item.plays}
                                likes={item.likes}
                                dislikes={item.dislikes}
                                loves={item.loves}
                            />
                        )
                    })
                }
            </div>
            <div className="flex w-full fixed justify-center items-center bottom-5">
                <PageController currentPage={currentPage} nextPage={nextPage}
                    onNext={() => handleNext()} onPrev={() => handlePrev()}
                />
            </div>
        </div>
    )

};