import environmentSettings from "~/environment";
import { AxiosClient } from "./http/AxiosClient";
import type { TrackDownloadDTO } from "~/dtos/track_download_dto";

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
}