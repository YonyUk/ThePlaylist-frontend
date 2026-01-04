import environmentSettings from "~/environment";
import { AxiosClient } from "./http/AxiosClient";
import type { PlaylistDTO } from "~/dtos/playlistdto";

export class PlaylistService {

    private axiosClient: AxiosClient;
    private static instance: PlaylistService;
    private environmentSettings = environmentSettings();

    private constructor( ) {
        this.axiosClient = new AxiosClient(String(`${this.environmentSettings.apiUrl}`));
    }

    public static get():PlaylistService{
        if (!this.instance)
            this.instance = new PlaylistService();
        return this.instance;
    }

    public async getPlaylist(id:string){
        return await this.axiosClient.get<PlaylistDTO>(`/${this.environmentSettings.playlistsUrl}/${id}`);
    }



}