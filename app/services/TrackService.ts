import environmentSettings from "~/environment";
import { AxiosClient } from "./http/AxiosClient";
import type { TrackDownloadDTO } from "~/dtos/track_download_dto";
import type { TrackDTO, TrackUpdateDTO } from "~/dtos/trackdto";

export class TrackService{

    private axiosClient:AxiosClient;
    private static instance:TrackService;
    private environmentSettings = environmentSettings();

    private constructor( ) {
        this.axiosClient = new AxiosClient(String(`${this.environmentSettings.apiUrl}/${this.environmentSettings.tracksUrl}`));
    }

    public static get() : TrackService {
        if (!this.instance)
            this.instance = new TrackService();
        return this.instance;
    }

    public async getTrack(id:string) {
        return await this.axiosClient.get<TrackDownloadDTO>(`/download/${id}`,{timeout:30000});
    }

    public async updateTrack(id:string,track:TrackUpdateDTO) {
        return await this.axiosClient.put<TrackDTO>(`${id}/stats`,track);
    }

    public async getTrackInfo(id:string) {
        return await this.axiosClient.get<TrackDTO>(id);
    }
}