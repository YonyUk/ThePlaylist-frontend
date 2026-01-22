import { useEffect, useState } from "react"
import type { TrackDownloadDTO } from "~/dtos/track_download_dto";
import type { TrackDTO } from "~/dtos/trackdto";
import { TrackService } from "~/services/TrackService";

export const useGetTrack = (id: string | null) => {
    const service = TrackService.get();

    const [loading, setLoading] = useState(true);
    const [track, setTrack] = useState<TrackDownloadDTO | null>(null);
    const [track_id, setTrackId] = useState(id);
    const [expires, setExpires] = useState(0);

    const getTrack = (id_: string | null) => {
        setLoading(true);
        setTrack(null);
        if (id_) {
            service.getTrack(id_)
                .then((resp) => {
                    if (resp.status === 200) {
                        setTrack(resp.data);
                        setExpires(resp.data.expires);
                    }
                })
                .finally(() => {
                    setLoading(false);
                });
        }
    }
    useEffect(() => {
        getTrack(track_id);
    }, [track_id]);

    return { loading, track, setTrackId, refreshTrack: getTrack };
}

export const useGetTrackInfo = (id: string) => {
    const service = TrackService.get();

    const [track, setTrack] = useState<TrackDTO | null>(null);

    useEffect(() => {
        service.getTrackInfo(id).then(resp => {
            if (resp.status === 200)
                setTrack(resp.data);
        });
    }, [id])

    return track;
}

export const useGetTracks = (page: number = 0, playlist_id?: string) => {
    const service = TrackService.get();

    const [tracks, setTracks] = useState<TrackDTO[]>([]);
    const [currentPage, setPage] = useState(page ?? 0);
    const [playlistId, setPlaylistId] = useState(playlist_id);
    const [nextPage, setNextPage] = useState(false);

    useEffect(() => {
        service.getTracks(currentPage, playlistId).then(resp => {
            if (resp.status === 200)
                setTracks(resp.data);
        });
        service.getTracks(currentPage + 1, playlistId).then(resp => {
            if (resp.status === 200)
                setNextPage(resp.data.length > 0);
        });
    }, [currentPage]);

    useEffect(() => {
        service.getTracks(currentPage, playlistId).then(resp => {
            if (resp.status === 200)
                setTracks(resp.data);
        });
        service.getTracks(currentPage + 1, playlistId).then(resp => {
            if (resp.status === 200)
                setNextPage(resp.data.length > 0);
        });
    }, [playlistId]);

    const refreshTracks = () => {
        service.getTracks(currentPage, playlistId).then(resp => {
            if (resp.status === 200)
                setTracks(resp.data);
        });
        service.getTracks(currentPage + 1, playlistId).then(resp => {
            if (resp.status === 200)
                setNextPage(resp.data.length > 0);
        });
    }

    return {
        tracks,
        nextPage,
        setPage,
        setPlaylistId,
        refreshTracks
    }
}