import { useEffect, useState } from "react"
import { PlaylistService } from "~/services/PlaylistService";

export enum PlaylistInfoLoadState {
    IDLE,
    PENDING,
    DONE,
    FAILED,
    PARTIAL
}

export const useGetUserPlaylistStats = (id:string) => {
    const service = PlaylistService.get();
    const [liked,setLiked] = useState(false);
    const [disliked,setDisliked] = useState(false);
    const [loved,setLoved] = useState(false);
    const [infoState,setInfoState] = useState(PlaylistInfoLoadState.IDLE);

    const loadInfoStats = () => {
        setInfoState(PlaylistInfoLoadState.PENDING);
        (async () => {
            const likeResponse = await service.liked(id);
            const dislikeResponse = await service.disliked(id);
            const loveResponse = await service.loved(id);

            if (likeResponse.status === 200){
                setLiked(likeResponse.data.result);
                setInfoState(PlaylistInfoLoadState.PARTIAL);
            }

            if (dislikeResponse.status === 200){
                setDisliked(dislikeResponse.data.result);
                setInfoState(PlaylistInfoLoadState.PARTIAL);
            }

            if (loveResponse.status === 200){
                setLoved(loveResponse.data.result);
                setInfoState(PlaylistInfoLoadState.PARTIAL);
            }

            if (
                likeResponse.status !== 200 &&
                dislikeResponse.status !== 200 &&
                loveResponse.status !== 200
            )
                setInfoState(PlaylistInfoLoadState.FAILED);

            if (
                likeResponse.status === dislikeResponse.status && 
                dislikeResponse.status === loveResponse.status &&
                loveResponse.status === 200
            )
                setInfoState(PlaylistInfoLoadState.DONE);
        })();

    };

    useEffect(() => {
        loadInfoStats();
    },[id]);

    return {
        infoState,
        isLiked:liked,
        isDisliked:disliked,
        isLoved:loved,
        refreshStats:loadInfoStats
    };
}