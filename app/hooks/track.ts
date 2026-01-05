import { useEffect, useState } from "react"
import type { TrackDownloadDTO } from "~/dtos/track_download_dto";
import { TrackService } from "~/services/TrackService";

export const useGetTrack = (id: string | null) => {
    const service = TrackService.get();

    const [loading, setLoading] = useState(true);
    const [track, setTrack] = useState<TrackDownloadDTO | null>(null);
    const [track_id, setTrackId] = useState(id);
    const [expires,setExpires] = useState(0);

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

    return { loading, track, setTrackId,refreshTrack:getTrack };
}