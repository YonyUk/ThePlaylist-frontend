import { TrackService } from "~/services/TrackService";
import type { Route } from "./+types/mytracks";
import { UserService } from "~/services/UserService";
import { redirect, useNavigate, useRevalidator } from "react-router";
import { ROUTES } from "~/routes";
import type { AxiosError } from "axios";
import SearchBar from "~/components/searchbar/searchbar";
import type { TrackDTO } from "~/dtos/trackdto";
import PlayListTrackItem from "~/components/playlist_track_item/playlist_track_item";
import { useState } from "react";
import { MdNavigateNext } from "react-icons/md";
import { MdNavigateBefore } from "react-icons/md";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { FaRedoAlt } from "react-icons/fa";
import PageController from "~/components/pagecontroller/pagecontroller";
import AddItem from "~/components/add_item/add_item";

interface ClientLoaderData {
    tracks: TrackDTO[];
    next: boolean;
    currentPage: number;
}

export async function clientLoader({ params }: Route.ClientLoaderArgs) {
    const service = TrackService.get();
    const userService = UserService.get();

    const page = params.page;

    const authenticated = await userService.authenticated();
    if (!authenticated)
        return redirect(ROUTES.LOGIN);

    try {
        const tracksResponse = await service.getMyTracks(parseInt(page));
        const nextTracks = await service.getMyTracks(parseInt(page) + 1);
        return {
            tracks: tracksResponse.data,
            next: nextTracks.data.length > 0,
            currentPage: parseInt(page)
        } as ClientLoaderData;
    } catch (error) {
        return (error as AxiosError).response?.data
    }
}

export default function MyTracks({ loaderData }: Route.ComponentProps) {

    const service = TrackService.get();
    const data = loaderData as ClientLoaderData;
    const [tracks, setTracks] = useState(data.tracks);
    const [page, setPage] = useState(data.currentPage);
    const [next, setNext] = useState(data.next);
    const [textPattern, setTextPattern] = useState('');

    const navigate = useNavigate();

    const removeTrack = async (trackId: string) => {
        const response = await service.removeTrack(trackId);
        if (response.status === 401)
            navigate(ROUTES.LOGIN);
        if (response.status === 202)
            setTracks(tracks.filter((track, _) => track.id !== trackId));
        return response.status === 202;
    }

    const searchByPattern = async (text: string) => {
        try {
            const tracksResponse = await service.getMyTracks(0, text);
            const nextTracksResponse = await service.getMyTracks(1, text);
            setTracks(tracksResponse.data);
            setNext(nextTracksResponse.data.length > 0);
            setPage(0);
            setTextPattern(text);
        } catch (error) {

        }
    }

    const handleNextPage = async (nextPage: number) => {
        navigate(`${ROUTES.MYTRACKS}/${nextPage}`);
        try {
            const tracksResponse = await service.getMyTracks(nextPage, textPattern);
            const nextTracksResponse = await service.getMyTracks(nextPage + 1, textPattern);
            setTracks(tracksResponse.data);
            setNext(nextTracksResponse.data.length > 0);
            setPage(nextPage);
        } catch (error) {

        }
    }

    const handlePrevPage = async (prevPage: number) => {
        navigate(`${ROUTES.MYTRACKS}/${prevPage}`);
        try {
            const tracksResponse = await service.getMyTracks(prevPage, textPattern);
            setTracks(tracksResponse.data);
            setNext(true);
            setPage(prevPage);
        } catch (error) {

        }
    }

    return (
        <div
            className="flex flex-col pl-18 w-full h-22/25 items-center p-2 overflow-y-auto"
        >
            <SearchBar onSearchClick={(value: string) => searchByPattern(value)} />
            <div className="flex flex-col mt-2 h-4/5 w-full p-2 rounded-md items-center bg-[#00000045]
            overflow-y-auto
                    
            [&::-webkit-scrollbar]:w-2
            [&::-webkit-scrollbar-track]:rounded-full
            [&::-webkit-scrollbar-thumb]:bg-[#ffffff35]
            [&::-webkit-scrollbar-thumb]:rounded-full
            [&::-webkit-scrollbar-thumb:hover]:bg-[#ffffff65]
            [&::-webkit-scrollbar-thumb:hover]:cursor-pointer

            scrollbar-thin
            scrollbar-thumb-gray-400
            scrollbar-track-gray-100
            scrollbar-track-rounded
            scrollbar-thumb-rounded
            ">
                <h1>Tracks</h1>
                {
                    tracks.map((trackItem, index) => (
                        <PlayListTrackItem track_id={trackItem.id} key={index} dispensable={true}
                            onRemoveClicked={(trackId: string) => removeTrack(trackId)} />
                    ))
                }
            </div>
            <div className="p-2">
                <PageController
                    currentPage={page}
                    nextPage={next}
                    onNext={() => {
                        if (next)
                            handleNextPage(page + 1);
                    }}
                    onPrev={() => {
                        if (page > 0)
                            handlePrevPage(page - 1);
                    }}
                />
            </div>
            <button onClick={() => navigate(`${ROUTES.MYTRACKS}/upload`)}
            className="flex flex-row justify-end items-center fixed bottom-5 right-5">
                <AddItem iconSize={30} height={35} width={35}/>
            </button>
        </div>
    )
}