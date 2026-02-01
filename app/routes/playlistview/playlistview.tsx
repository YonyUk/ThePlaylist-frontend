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
import type { TrackDTO } from "~/dtos/trackdto";
import { redirect } from "react-router";
import PlayListTrackItem from "~/components/playlist_track_item/playlist_track_item";
import { FaRedoAlt } from "react-icons/fa";
import ComboBoxFloatingButton, { type ComboboxFloatingButtonOption } from "~/components/floatingbutton/comboboxfloatingbutton";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import { AiFillLike, AiOutlineLike, AiFillDislike, AiOutlineDislike } from "react-icons/ai";
import { PlaylistInfoLoadState, useGetUserPlaylistStats } from "~/hooks/playlist";

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

const onTrackLiked = async (trackId: string, callback: (data: TrackDTO) => void) => {
    const service = TrackService.get();
    try {
        const response = await service.addLike(trackId);
        callback(response.data);
    } catch (error) {

    }
}

const onTrackLikeRemoved = async (trackId: string, callback: (data: TrackDTO) => void) => {
    const service = TrackService.get();
    try {
        const response = await service.removeLike(trackId);
        callback(response.data);
    } catch (error) {

    }
}

const onTrackDisliked = async (trackId: string, callback: (data: TrackDTO) => void) => {
    const service = TrackService.get();
    try {
        const response = await service.addDislike(trackId);
        callback(response.data);
    } catch (error) {

    }
}

const onTrackDislikeRemoved = async (trackId: string, callback: (data: TrackDTO) => void) => {
    const service = TrackService.get();
    try {
        const response = await service.removeDislike(trackId);
        callback(response.data);
    } catch (error) {

    }
}

const onTrackLoved = async (trackId: string, callback: (data: TrackDTO) => void) => {
    const service = TrackService.get();
    try {
        const response = await service.addLove(trackId);
        callback(response.data);
    } catch (error) {

    }
}

const onTrackLoveRemoved = async (trackId: string, callback: (data: TrackDTO) => void) => {
    const service = TrackService.get();
    try {
        const response = await service.removeLove(trackId);
        callback(response.data);
    } catch (error) {

    }
}

const addLikeToPlaylist = async (playlistId: string) => {
    const service = PlaylistService.get();
    try {
        const response = await service.addLikeToPlaylist(playlistId);
        return response.status === 202;
    } catch (error) {
        return false;
    }
}

const removeLikeFromPlaylist = async (playlistId: string) => {
    const service = PlaylistService.get();
    try {
        const response = await service.removeLikeFromPlaylist(playlistId);
        return response.status === 202;
    } catch (error) {
        return false;
    }
}

const addDislikeToPlaylist = async (playlistId: string) => {
    const service = PlaylistService.get();
    try {
        const response = await service.addDislikeToPlaylist(playlistId);
        return response.status === 202;
    } catch (error) {
        return false;
    }
}

const removeDislikeFromPlaylist = async (playlistId: string) => {
    const service = PlaylistService.get();
    try {
        const response = await service.removeDislikeFromPlaylist(playlistId);
        return response.status === 202;
    } catch (error) {
        return false;
    }
}

const addLoveToPlaylist = async (playlistId: string) => {
    const service = PlaylistService.get();
    try {
        const response = await service.addLoveToPlaylist(playlistId);
        return response.status === 202;
    } catch (error) {
        return false;
    }
}

const removeLoveFromPlaylist = async (playlistId: string) => {
    const service = PlaylistService.get();
    try {
        const response = await service.removeLoveFromPlaylist(playlistId);
        return response.status === 202;
    } catch (error) {
        return false;
    }
}

const MenuItems: ComboboxFloatingButtonOption[] = [
    {
        description: 'likes',
        primaryIcon: <AiOutlineLike size={20} />,
        secondaryIcon: <AiFillLike size={20} />,
    },
    {
        description: 'dislikes',
        primaryIcon: <AiOutlineDislike size={20} />,
        secondaryIcon: <AiFillDislike size={20} />
    },
    {
        description: 'loves',
        primaryIcon: <FaRegHeart size={20} />,
        secondaryIcon: <FaHeart size={20} />
    }
]

export default function PlayListView({ loaderData, params }: Route.ComponentProps) {
    const service = TrackService.get();
    const playlistService = PlaylistService.get();
    const [tracks, setTracks] = useState((loaderData as PlaylistDTO).tracks);
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
    const trackContainerWidth = 160;
    const trackContainerHeight = 300;

    const {
        infoState,
        isLiked,
        isDisliked,
        isLoved,
        refreshStats
    } = useGetUserPlaylistStats(params.playlistId);

    MenuItems[0].primary = !isLiked;
    MenuItems[0].onSelect = async () => addLikeToPlaylist(params.playlistId);
    MenuItems[0].onDeselect = async () => removeLikeFromPlaylist(params.playlistId);

    MenuItems[1].primary = !isDisliked;
    MenuItems[1].onSelect = async () => addDislikeToPlaylist(params.playlistId);
    MenuItems[1].onDeselect = async () => removeDislikeFromPlaylist(params.playlistId);

    MenuItems[2].primary = !isLoved;
    MenuItems[2].onSelect = async () => addLoveToPlaylist(params.playlistId);
    MenuItems[2].onDeselect = async () => removeLoveFromPlaylist(params.playlistId);

    const updateData = (data: TrackDTO) => {
        setLikes(data.likes);
        setDislikes(data.dislikes);
        setLoves(data.loves);
        setPlays(data.plays);
        tracks[currentTrackIndex] = data;
        setCurrentTrack(data);
    }

    const onPlayTrack = async () => {
        try {
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
            if (loadState === TrackLoadState.DONE) {
                const interval_ = setInterval(() => {
                    refreshTrack(track?.id ?? null);
                }, Number(track?.expires) * 1000);
                setInternalInterval(interval_);
            }
        }
    }, [loadState]);

    const searchTracksByPattern = (pattern: string) => {
        service.searchTracksOnPlaylist(params.playlistId, pattern).then(resp => {
            if (resp.status === 200) {
                setTracks(resp.data);
                setCurrentTrackIndex(0);
                setCurrentTrack(tracks[0]);
                setTrackId(tracks[0].id);
                setKeepPlay(false);
            }
        })
    }

    return (
        <div className="flex flex-col pl-18 w-full h-full items-center gap-5 p-2 overflow-y-auto">
            <SearchBar onSearchClick={searchTracksByPattern} />
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
                    onLiked={(value: boolean) => value ?
                        onTrackLiked(currentTrack.id, updateData) :
                        onTrackLikeRemoved(currentTrack.id, updateData)}
                    onDisliked={(value: boolean) => value ?
                        onTrackDisliked(currentTrack.id, updateData) :
                        onTrackDislikeRemoved(currentTrack.id, updateData)}
                    onLoved={(value: boolean) => value ?
                        onTrackLoved(currentTrack.id, updateData) :
                        onTrackLoveRemoved(currentTrack.id, updateData)}
                />
            }
            {
                loadState === TrackLoadState.LOADING &&
                <TrackLoading width={trackContainerWidth} height={trackContainerHeight} />
            }
            {
                loadState === TrackLoadState.FAILED &&
                <div style={{
                    width: trackContainerWidth,
                    height: trackContainerHeight
                }}
                    className="flex flex-col justify-center items-center bg-[#00000045] p-1 rounded-md text-[12px]">
                    <p>Track couldn't be loaded</p>
                    <button className="mt-3 cursor-pointer" onClick={() => refreshTrack(currentTrack.id)}>
                        <FaRedoAlt size={Math.min(trackContainerHeight, trackContainerWidth) / 6} />
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
                }
                onTrackEnded={() => playlistService.addPlayToPlaylist(params.playlistId)}
            />
            <div className="flex flex-col h-fit w-full px-5 rounded-md items-center
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
                {
                    tracks.map((trackItem, index) => (
                        <div
                            onClick={() => {
                                setCurrentTrackIndex(index);
                                setCurrentTrack(tracks[index]);
                                setTrackId(tracks[index].id);
                                setKeepPlay(keepPlay);
                            }}
                            key={index} className="flex w-full cursor-pointer hover:bg-[#00000045] rounded-md duration-500">
                            <PlayListTrackItem track_id={trackItem.id} />
                        </div>
                    ))
                }
            </div>
            <ComboBoxFloatingButton
                options={MenuItems}
                growDirection="col"
                marginBottom={5}
                marginRight={5}
                iconSize={30}
                height={35}
                refreshFunc={refreshStats}
            />
        </div>
    )
};