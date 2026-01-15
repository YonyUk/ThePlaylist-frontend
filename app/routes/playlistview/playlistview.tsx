import SearchBar from "~/components/searchbar/searchbar";
import type { Route } from "./+types/playlistview";
import { useCallback, useEffect, useState } from "react";
import CurrentSong from "~/components/currentsong/currentsong";
import SongBar from "~/components/songbar/songbar";
import { PlaylistService } from "~/services/PlaylistService";
import type { AxiosError } from "axios";
import { TrackService } from "~/services/TrackService";
import type { PlaylistDTO } from "~/dtos/playlistdto";
import { useGetTrack } from "~/hooks/track";
import TrackLoading from "~/components/track_loading/trackloading";
import { redirect, useLocation, useNavigate } from "react-router";
import { UserService } from "~/services/UserService";
import { ROUTES } from "~/routes";
import type { TrackDTO, TrackUpdateDTO } from "~/dtos/trackdto";

interface ClientLoaderOutputOK {
    playlist: PlaylistDTO;
    authenticated: boolean;
}

export async function clientLoader({ params }: Route.ClientLoaderArgs) {
    const playlist_id = params.playlistId;
    const service = PlaylistService.get();
    const userService = UserService.get();

    try {
        const response = await service.getPlaylist(playlist_id);
        try {
            const authenticated = await userService.authenticated();
            return {
                playlist: response.data,
                authenticated
            } as ClientLoaderOutputOK;
        } catch (error) {
            return {
                playlist: response.data,
                authenticated: false
            } as ClientLoaderOutputOK;
        }
    } catch (error) {
        return (error as AxiosError).response?.data;
    }
}

export default function PlayListView({ loaderData }: Route.ComponentProps) {
    const navigate = useNavigate();

    const loadedData = (loaderData as ClientLoaderOutputOK);

    const location = useLocation();
    const isEditMode = location.state.edit;
    const authenticated = loadedData.authenticated;

    useEffect(() => {
        if (isEditMode && !authenticated) {
            navigate(ROUTES.LOGIN);
        }
    }, []);

    const service = TrackService.get();

    const tracks = loadedData.playlist?.tracks;
    const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
    const [currentTrack, setCurrentTrack] = useState(tracks[currentTrackIndex]);
    const [likes,setLikes] = useState(0);
    const [dislikes,setDislikes] = useState(0);
    const [loves,setLoves] = useState(0);
    const [plays,setPlays] = useState(0);
    const { loading, track, setTrackId, refreshTrack } = useGetTrack(currentTrack.id);
    const [interval, setInternalInterval] = useState<NodeJS.Timeout | null>(null);
    const [keepPlay, setKeepPlay] = useState(false);

    const onPlayTrack = async () => {
        const response = await service.getTrackInfo(currentTrack.id);
        try {
            const track_data = response.data;
            const update_track_data: TrackUpdateDTO = {
                likes: track_data.likes,
                dislikes: track_data.dislikes,
                loves: track_data.loves,
                plays:track_data.plays + 1
            }
            service.updateTrackPlays(currentTrack.id);
        } catch (error) {
            
        }
    }

    const handleNext = (keepPlaying: boolean) => {
        if (isEditMode && !authenticated) {
            navigate(ROUTES.LOGIN);
        }
        setCurrentTrackIndex(currentTrackIndex + 1);
        setCurrentTrack(tracks[currentTrackIndex + 1]);
        setTrackId(tracks[currentTrackIndex + 1].id);
        setKeepPlay(keepPlaying);
    }

    const handlePrev = (keepPlaying: boolean) => {
        if (isEditMode && !authenticated) {
            navigate(ROUTES.LOGIN);
        }
        setCurrentTrackIndex(currentTrackIndex - 1);
        setCurrentTrack(tracks[currentTrackIndex - 1]);
        setTrackId(tracks[currentTrackIndex - 1].id);
        setKeepPlay(keepPlaying);
    }

    useEffect(() => {
        service.getTrackInfo(currentTrack.id)
        .then( resp => {
            if (resp.status === 200){
                setLikes(resp.data.likes);
                setDislikes(resp.data.dislikes);
                setLoves(resp.data.loves);
                setPlays(resp.data.plays);
            }
        })
    },[currentTrack]);

    useEffect(() => {
        if (!loading) {
            if (interval)
                clearInterval(interval);
            const interval_ = setInterval(() => {
                refreshTrack(track?.id ?? null);
            }, Number(track?.expires) * 1000);
            setInternalInterval(interval_);
        }
    }, [loading]);

    return (
        <div className="flex flex-col pl-18 w-full h-screen items-center gap-5 p-2 overflow-auto">
            <SearchBar />
            {
                track &&
                <CurrentSong
                    name={currentTrack.name.substring(0, currentTrack.name.indexOf('.'))}
                    id={currentTrack.id}
                    author_name={currentTrack.author_name}
                    likes={likes}
                    dislikes={dislikes}
                    loves={loves}
                    plays={plays}
                />
            }
            {
                !track &&
                <TrackLoading />
            }
            <SongBar src={track?.url}
                play={keepPlay}
                onPlay={onPlayTrack}
                onNext={
                    currentTrackIndex < tracks.length - 1 ?
                        handleNext : undefined
                }
                onPrev={
                    currentTrackIndex > 0 ?
                        handlePrev : undefined
                } />
            <div className="flex flex-col h-fit w-fit px-5 overflow-auto rounded-md items-center">

            </div>
        </div>
    )
};