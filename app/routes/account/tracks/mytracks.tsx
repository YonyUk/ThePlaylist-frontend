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
    const [page,setPage] = useState(data.currentPage);
    const [next,setNext] = useState(data.next);
    const [textPattern,setTextPattern] = useState('');

    const navigate = useNavigate();

    const removeTrack = async (trackId:string) => {
        const response = await service.removeTrack(trackId);
        if (response.status === 401)
            navigate(ROUTES.LOGIN);
        return response.status === 202;
    }    

    const searchByPattern = async (text:string) => {
        try {
            const tracksResponse = await service.getMyTracks(0,text);
            const nextTracksResponse = await service.getMyTracks(1,text);
            setTracks(tracksResponse.data);
            setNext(nextTracksResponse.data.length > 0);
            setPage(0);
            setTextPattern(text);
        } catch (error) {
            
        }
    }

    const handleNextPage = async (nextPage:number) => {
        navigate(`${ROUTES.MYTRACKS}/${nextPage}`);
        try{
            const tracksResponse = await service.getMyTracks(nextPage,textPattern);
            const nextTracksResponse = await service.getMyTracks(nextPage + 1,textPattern);
            setTracks(tracksResponse.data);
            setNext(nextTracksResponse.data.length > 0);
            setPage(nextPage);
        } catch (error){

        }
    }

    const handlePrevPage = async (prevPage:number) => {
        navigate(`${ROUTES.MYTRACKS}/${prevPage}`);
        try {
            const tracksResponse = await service.getMyTracks(prevPage,textPattern);
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
            <SearchBar onSearchClick={(value:string) => searchByPattern(value)}/>
            <div className="flex flex-col mt-2 h-4/5 w-full p-2 overflow-hidden rounded-md items-center bg-[#00000045]">
                <h1>Tracks</h1>
                {
                    tracks.map((trackItem, index) => (
                        <PlayListTrackItem track_id={trackItem.id} key={index} dispensable={true}
                        onRemoveClicked={(trackId:string) => removeTrack(trackId)}/>
                    ))
                }
            </div>
            <div
                className="flex flex-row justify-around mt-2 gap-2">
                <button 
                onClick={() => {
                    if (page > 0)
                        handlePrevPage(page - 1);
                }}
                className={`p-1 bg-[#00000045] rounded-md 
                    ${page === 0 && 'text-[#ffffff65]'} ${page !== 0 && 'cursor-pointer'}
                    `}>
                    <MdNavigateBefore size={20} />
                </button>
                <button className="flex flex-row justify-center items-center p-1 bg-[#00000045] rounded-md">
                    <small> {page} </small>
                </button>
                <button
                onClick={() => {
                    if (next)
                        handleNextPage(page + 1);
                }} 
                className={`p-1 bg-[#00000045] rounded-md 
                    ${!next && 'text-[#ffffff65]'} ${next && 'cursor-pointer'}
                    `}>
                    <MdNavigateNext size={20} />
                </button>
            </div>
        </div>
    )
}