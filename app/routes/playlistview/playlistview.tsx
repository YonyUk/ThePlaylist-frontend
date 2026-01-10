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

export async function clientLoader({ params }: Route.ClientLoaderArgs) {
    const playlist_id = params.playlistId;
    const service = PlaylistService.get();

    try {
        const response = await service.getPlaylist(playlist_id);
        return response.data;
    } catch (error) {
        return (error as AxiosError).response?.data;
    }
}

export default function PlayListView({ loaderData }: Route.ComponentProps) {
    const service = TrackService.get();

    const tracks = (loaderData as PlaylistDTO)?.tracks;
    const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
    const [currentTrack, setCurrentTrack] = useState(tracks[currentTrackIndex]);
    const { loading, track, setTrackId, refreshTrack } = useGetTrack(currentTrack.id);
    const [interval, setInternalInterval] = useState<NodeJS.Timeout | null>(null);
    const [keepPlay,setKeepPlay] = useState(false);

    const handleNext = ( keepPlaying:boolean) => {
        setCurrentTrackIndex(currentTrackIndex + 1);
        setCurrentTrack(tracks[currentTrackIndex + 1]);
        setTrackId(tracks[currentTrackIndex + 1].id);
        setKeepPlay(keepPlaying);
    }

    const handlePrev = (keepPlaying:boolean) => {
        setCurrentTrackIndex(currentTrackIndex - 1);
        setCurrentTrack(tracks[currentTrackIndex - 1]);
        setTrackId(tracks[currentTrackIndex - 1].id);
        setKeepPlay(keepPlaying);
    }

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
                    name={currentTrack.name.substring(0,currentTrack.name.indexOf('.'))}
                    id={currentTrack.id}
                    author_name={currentTrack.author_name}
                    likes={currentTrack.likes}
                    dislikes={currentTrack.dislikes}
                    loves={currentTrack.loves}
                />
            }
            {
                !track &&
                <TrackLoading/>
            }
            <SongBar src={track?.url}
                play={keepPlay}
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