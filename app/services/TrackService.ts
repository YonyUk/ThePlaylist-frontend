import environmentSettings from "~/environment";
import { AxiosClient } from "./http/AxiosClient";
import type { TrackDownloadDTO } from "~/dtos/track_download_dto";
import type { TrackDTO, TrackUpdateDTO } from "~/dtos/trackdto";
import type { ExistencialQuery } from "~/types/responsetypes";

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

    public async updateTrackPlays(id:string){
        return await this.axiosClient.put<TrackDTO>(`${id}/stats/plays`);
    }

    public async isLiked(id:string){
        return await this.axiosClient.get<ExistencialQuery>(`${id}/stats/likes`);
    }

    public async addLike(id:string){
        return await this.axiosClient.put<TrackDTO>(`${id}/stats/likes`);
    }

    public async removeLike(id:string){
        return await this.axiosClient.delete<TrackDTO>(`${id}/stats/likes`);
    }

    public async isDisliked(id:string){
        return await this.axiosClient.get<ExistencialQuery>(`${id}/stats/dislikes`);
    }

    public async addDislike(id:string){
        return await this.axiosClient.put<TrackDTO>(`${id}/stats/dislikes`);
    }

    public async removeDislike(id:string){
        return await this.axiosClient.delete<TrackDTO>(`${id}/stats/dislikes`);
    }

    public async isLoved(id:string){
        return await this.axiosClient.get<ExistencialQuery>(`${id}/stats/loves`)
    }

    public async addLove(id:string){
        return await this.axiosClient.put<TrackDTO>(`${id}/stats/loves`);
    }

    public async removeLove(id:string){
        return await this.axiosClient.delete<TrackDTO>(`${id}/stats/loves`);
    }

    public async getTrackInfo(id:string) {
        return await this.axiosClient.get<TrackDTO>(id);
    }

    public async getMyTracks(page:number=0,pattern:string=''){
        return await this.axiosClient.get<TrackDTO[]>("mytracks",{
            params:{
                page,
                text:pattern,
                limit:10
            }
        });
    }
}