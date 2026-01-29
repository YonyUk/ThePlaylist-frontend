import SearchBar from "~/components/searchbar/searchbar";
import type { Route } from "./+types/playlistview";
import { useEffect, useState } from "react";
import CurrentSong from "~/components/currentsong/currentsong";
import SongBar from "~/components/songbar/songbar";
import { PlaylistService } from "~/services/PlaylistService";
import type { AxiosError } from "axios";
import { TrackService } from "~/services/TrackService";
import type { PlaylistDTO } from "~/dtos/playlistdto";
import { TrackLoadState, useGetTrack } from "~/hooks/track";
import TrackLoading from "~/components/track_loading/trackloading";
import { UserService } from "~/services/UserService";
import { ROUTES } from "~/routes";
import type { TrackDTO, TrackUpdateDTO } from "~/dtos/trackdto";
import { redirect } from "react-router";
import PlayListTrackItem from "~/components/playlist_track_item/playlist_track_item";
import { FaRedoAlt } from "react-icons/fa";

export async function clientLoader({ params }: Route.ClientLoaderArgs) {
    const playlist_id = params.playlistId;
    const service = PlaylistService.get();
    const userService = UserService.get();

    try {
        const authenticated = await userService.authenticated();
        if (!authenticated)
            return redirect(ROUTES.LOGIN);
    } catch (error) {
        return redirect(ROUTES.LOGIN);
    }

    try {
        const response = await service.getPlaylist(playlist_id);
        return response.data;
    } catch (error) {
        return (error as AxiosError).response?.data;
    }
}

export default function PlayListView({ loaderData }: Route.ComponentProps) {
    const service = TrackService.get();

    const tracks = (loaderData as PlaylistDTO).tracks;
    const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
    const [currentTrack, setCurrentTrack] = useState(tracks[currentTrackIndex]);
    const [likes, setLikes] = useState(0);
    const [dislikes, setDislikes] = useState(0);
    const [loves, setLoves] = useState(0);
    const [plays, setPlays] = useState(0);
    const { loadState, track, setTrackId, refreshTrack } = useGetTrack(currentTrack.id);
    const [interval, setInternalInterval] = useState<NodeJS.Timeout | null>(null);
    const [keepPlay, setKeepPlay] = useState(false);
    const [liked, setLiked] = useState(false);
    const [disliked, setDisliked] = useState(false);
    const [loved, setLoved] = useState(false);
    const trackContainerWidth = 150;
    const trackContainerHeight = 200;

    const updateData = (data: TrackDTO) => {
        setLikes(data.likes);
        setDislikes(data.dislikes);
        setLoves(data.loves);
        setPlays(data.plays);
        tracks[currentTrackIndex] = data;
        setCurrentTrack(data);
    }

    const onTrackLiked = async () => {
        try {
            const response = await service.addLike(currentTrack.id);
            updateData(response.data);
        } catch (error) {

        }
    }

    const onTrackLikeRemoved = async () => {
        try {
            const response = await service.removeLike(currentTrack.id);
            updateData(response.data);
        } catch (error) {

        }
    }

    const onTrackDisliked = async () => {
        try {
            const response = await service.addDislike(currentTrack.id);
            updateData(response.data);
        } catch (error) {

        }
    }

    const onTrackDislikeRemoved = async () => {
        try {
            const response = await service.removeDislike(currentTrack.id);
            updateData(response.data);
        } catch (error) {

        }
    }

    const onTrackLoved = async () => {
        try {
            const response = await service.addLove(currentTrack.id);
            updateData(response.data);
        } catch (error) {

        }
    }

    const onTrackLoveRemoved = async () => {
        try {
            const response = await service.removeLove(currentTrack.id);
            updateData(response.data);
        } catch (error) {

        }
    }

    const onPlayTrack = async () => {
        const response = await service.getTrackInfo(currentTrack.id);
        try {
            const track_data = response.data;
            const update_track_data: TrackUpdateDTO = {
                likes: track_data.likes,
                dislikes: track_data.dislikes,
                loves: track_data.loves,
                plays: track_data.plays + 1
            }
            service.updateTrackPlays(currentTrack.id);
        } catch (error) {

        }
    }

    const handleNext = (keepPlaying: boolean) => {
        setCurrentTrackIndex(currentTrackIndex + 1);
        setCurrentTrack(tracks[currentTrackIndex + 1]);
        setTrackId(tracks[currentTrackIndex + 1].id);
        setKeepPlay(keepPlaying);
    }

    const handlePrev = (keepPlaying: boolean) => {
        setCurrentTrackIndex(currentTrackIndex - 1);
        setCurrentTrack(tracks[currentTrackIndex - 1]);
        setTrackId(tracks[currentTrackIndex - 1].id);
        setKeepPlay(keepPlaying);
    }

    useEffect(() => {
        service.getTrackInfo(currentTrack.id)
            .then(resp => {
                if (resp.status === 200) {
                    setLikes(resp.data.likes);
                    setDislikes(resp.data.dislikes);
                    setLoves(resp.data.loves);
                    setPlays(resp.data.plays);
                }
            })
        service.isLiked(currentTrack.id).then(resp => setLiked(resp.data.result));
        service.isDisliked(currentTrack.id).then(resp => setDisliked(resp.data.result));
        service.isLoved(currentTrack.id).then(resp => setLoved(resp.data.result));
    }, [currentTrack]);

    useEffect(() => {
        if (loadState !== TrackLoadState.LOADING) {
            if (interval)
                clearInterval(interval);
            if (loadState === TrackLoadState.DONE){
                const interval_ = setInterval(() => {
                    refreshTrack(track?.id ?? null);
                }, Number(track?.expires) * 1000);
                setInternalInterval(interval_);
            }
        }
    }, [loadState]);

    return (
        <div className="flex flex-col pl-18 w-full h-screen items-center gap-5 p-2 overflow-y-auto">
            <SearchBar />
            {
                track &&
                <CurrentSong
                width={trackContainerWidth}
                height={trackContainerHeight}
                    name={currentTrack.name.substring(0, currentTrack.name.indexOf('.'))}
                    id={currentTrack.id}
                    author_name={currentTrack.author_name}
                    likes={likes}
                    dislikes={dislikes}
                    loves={loves}
                    plays={plays}
                    liked={liked}
                    disliked={disliked}
                    loved={loved}
                    onLiked={(value: boolean) => value ? onTrackLiked() : onTrackLikeRemoved()}
                    onDisliked={(value: boolean) => value ? onTrackDisliked() : onTrackDislikeRemoved()}
                    onLoved={(value: boolean) => value ? onTrackLoved() : onTrackLoveRemoved()}
                />
            }
            {
                loadState === TrackLoadState.LOADING &&
                <TrackLoading width={trackContainerWidth} height={trackContainerHeight}/>
            }
            {
                loadState === TrackLoadState.FAILED &&
                <div style={{
                    width:trackContainerWidth,
                    height:trackContainerHeight
                }}
                className="flex flex-col justify-center items-center bg-[#00000045] p-1 rounded-md text-[12px]">
                    <p>Track couldn't be loaded</p>
                    <button className="mt-3 cursor-pointer" onClick={() => refreshTrack(currentTrack.id)}>
                        <FaRedoAlt size={Math.min(trackContainerHeight,trackContainerWidth) / 6}/>
                    </button>
                </div>
            }
            <SongBar src={track?.url}
                play={keepPlay}
                onPlay={loadState === TrackLoadState.DONE ? onPlayTrack : undefined}
                onNext={
                    currentTrackIndex < tracks.length - 1 ?
                        handleNext : undefined
                }
                onPrev={
                    currentTrackIndex > 0 ?
                        handlePrev : undefined
                } />
            <div className="flex flex-col h-fit w-full px-5 overflow-hidden rounded-md items-center">
                {
                    tracks.map((trackItem,index) => (
                        <PlayListTrackItem track_id={trackItem.id} key={index}/>
                    ))
                }
            </div>
        </div>
    )
};