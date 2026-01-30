import { useEffect, useState } from "react"
import { PlaylistService } from "~/services/PlaylistService";

export enum PlaylistInfoLoadState {
    IDLE,
    PENDING,
    DONE,
    FAILED
}

export const useGetUserPlaylistStats = (id:string) => {
    const service = PlaylistService.get();
    const [liked,setLiked] = useState(false);
    const [disliked,setDisliked] = useState(false);
    const [loved,setLoved] = useState(false);
    const [infoState,setInfoState] = useState(PlaylistInfoLoadState.IDLE);

    const loadInfoStats = () => {
        setInfoState(PlaylistInfoLoadState.PENDING);
        service.liked(id).then( resp => {
            if (resp.status === 200){
                setLiked(resp.data.result);
                setInfoState(PlaylistInfoLoadState.DONE);
            } else
                setInfoState(PlaylistInfoLoadState.FAILED);
        }).catch(err => setInfoState(PlaylistInfoLoadState.FAILED));
    };

    useEffect(() => {
        loadInfoStats();
    },[id]);

    return {
        infoState,
        isLiked:liked,
        refreshStats:loadInfoStats
    };
}