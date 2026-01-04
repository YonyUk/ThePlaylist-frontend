import { useEffect, useState } from "react"
import type { TrackDownloadDTO } from "~/dtos/track_download_dto";
import { TrackService } from "~/services/TrackService";

export const useGetTrack = (id: string | null) => {
    const service = TrackService.get();

    const [loading, setLoading] = useState(true);
    const [track, setTrack] = useState<TrackDownloadDTO | null>(null);


    useEffect(() => {
        setLoading(true);
        setTrack(null);
        if (id) {
            service.getTrack(id)
                .then((resp) => {
                    if (resp.status === 200) {
                        setTrack(resp.data)
                    }
                    setLoading(false);
                })
        }
    }, [id]);

    return { loading, track };
}