import { TrackService } from "~/services/TrackService";
import { UserService } from "~/services/UserService";
import { redirect, useNavigate } from "react-router";
import { ROUTES } from "~/routes";
import type { AxiosError } from "axios";
import SearchBar from "~/components/searchbar/searchbar";
import PlayListTrackItem from "~/components/playlist_track_item/playlist_track_item";
import type { Route } from "./+types/add_tracks_from_cloud";
import type { TrackDTO } from "~/dtos/trackdto";
import { PlaylistService } from "~/services/PlaylistService";
import { useGetTracks } from "~/hooks/track";
import { useEffect, useState } from "react";
import PageController from "~/components/pagecontroller/pagecontroller";
import { HiOutlineX } from "react-icons/hi";

interface MyLoadedData {
    tracks: TrackDTO[];
    playlistId: string;
    page: number;
    nextPage: boolean;
}

export async function clientLoader({ params }: Route.ClientLoaderArgs) {
    const service = TrackService.get();
    const userService = UserService.get();

    const page = params.page;
    const id = params.playlistId;

    const authenticated = await userService.authenticated();
    if (!authenticated)
        return redirect(ROUTES.LOGIN);

    try {
        const tracksResponse = await service.getMyTracks(parseInt(page));
        const nextTracksResponse = await service.getMyTracks(parseInt(page) + 1);

        return {
            tracks: tracksResponse.data,
            playlistId: id,
            page: parseInt(page),
            nextPage: nextTracksResponse.data.length > 0
        } as MyLoadedData;
    } catch (error) {
        return (error as AxiosError).response?.data
    }
}

export default function AddTracksFromCloud({ loaderData }: Route.ComponentProps) {

    const service = PlaylistService.get();
    const trackService = TrackService.get();
    const data = loaderData as MyLoadedData;
    const [userTracks, setUserTracks] = useState(data.tracks);
    const playlistId = data.playlistId;
    // the current page of tracks uploadeds by user
    const [currentPage, setCurrentPage] = useState(data.page);
    // true if there is a next page of tracks uploadeds by user
    const nextUserTracksPage = data.nextPage;
    const [playlistName, setPlaylistName] = useState('');
    // current page of tracks addeds to the current playlist
    const [tracksPage, setTracksPage] = useState(0);

    const navigate = useNavigate();

    useEffect(() => {
        service.getPlaylist(playlistId).then(resp => setPlaylistName(resp.data.name));
    }, [playlistId]);

    const {
        tracks,
        nextPage,
        setPage,
        refreshTracks
    } = useGetTracks(tracksPage, playlistId);

    const addTrackToPlaylist = async (trackId: string) => {
        const response = await service.addTrackToPlaylist(playlistId, trackId);
        refreshTracks();
    }

    const removeTrackFromPlaylist = async (trackId: string) => {
        const response = await service.removeTrackFromPlaylist(playlistId, trackId);
        refreshTracks();
    }

    const handleNext = () => {
        navigate(`${ROUTES.MYPLAYLISTS}/${playlistId}/modify/add_from_cloud/${currentPage + 1}`);
        setCurrentPage(currentPage + 1);
    }

    const handlePrev = () => {
        navigate(`${ROUTES.MYPLAYLISTS}/${playlistId}/modify/add_from_cloud/${currentPage - 1}`);
        setCurrentPage(currentPage - 1);
    }

    const searchTracksByName = async (name: string) => {
        try {
            const response = await trackService.getMyTracks(currentPage, name);
            setUserTracks(response.data);
        } catch (error) {

        }
    }

    return (
        <div
            className="flex flex-col pl-18 w-full h-22/25 items-center gap-5 p-2 overflow-y-auto"
        >
            <SearchBar onSearchClick={searchTracksByName} />
            <div className="flex flex-row h-full w-full gap-2">
                <div className="flex flex-col h-full w-full p-2 overflow-hidden rounded-md items-center bg-[#00000045]">
                    <h1>Aviables tracks</h1>
                    <div className="flex flex-col w-full h-full overflow-y-auto">
                        {
                            userTracks.map((trackItem, index) => (
                                <PlayListTrackItem
                                    track_id={trackItem.id}
                                    key={index}
                                    dashboardControls={true}
                                    onAddClicked={addTrackToPlaylist}
                                />
                            ))
                        }
                    </div>
                    <PageController currentPage={currentPage} nextPage={nextUserTracksPage}
                        onNext={handleNext}
                        onPrev={handlePrev} />
                </div>
                <div className="flex flex-col h-full w-1/3 p-2 overflow-hidden rounded-md justify-start items-center bg-[#00000045]">
                    <h1>{playlistName}</h1>
                    <hr className="flex w-full my-2" />
                    <div
                        className="flex flex-col h-full w-full justify-start items-center overflow-y-auto gap-1"
                    >
                        {
                            tracks.map((track, index) => (
                                <div
                                    className="flex flex-row h-fit w-full items-center justify-between p-1 text-[12px] px-3 backdrop-blur-xs rounded-md bg-[#ffffff25]"
                                    key={index}>
                                    <div>
                                        {track.name.substring(0, track.name.lastIndexOf('.'))}
                                    </div>
                                    <div onClick={() => removeTrackFromPlaylist(track.id)}
                                        className="hover:bg-[#00000045] cursor-pointer rounded-xs duration-500">
                                        <HiOutlineX size={15} />
                                    </div>
                                </div>
                            ))
                        }
                    </div>
                    <PageController currentPage={tracksPage} nextPage={nextPage}
                        onNext={() => {
                            if (nextPage) {
                                setPage(tracksPage + 1);
                                setTracksPage(tracksPage + 1);
                            }
                        }}
                        onPrev={() => {
                            if (tracksPage > 0) {
                                setPage(tracksPage - 1);
                                setTracksPage(tracksPage + 1);
                            }
                        }} />
                </div>
            </div>
            <div className="flex w-full justify-end px-3">
                <button onClick={() => navigate(`${ROUTES.MYPLAYLISTS}/0`)} 
                className="p-1 px-2 bg-[#ffffff15] backdrop-blur-xs rounded-md hover:bg-[#00000045] cursor-pointer duration-500">
                    Done
                </button>
            </div>
        </div>
    )
}