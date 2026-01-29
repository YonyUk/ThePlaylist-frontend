import environmentSettings from "~/environment";
import { AxiosClient } from "./http/AxiosClient";
import type { CreatePlaylistDTO, PlaylistDTO } from "~/dtos/playlistdto";
import type { ExistencialQuery } from "~/types/responsetypes";

enum PlaylistSearchMode {
    BY_NAME = 'by name',
    BY_AUTHOR = 'by author',
    BOTH = 'both'
}

export class PlaylistService {

    private axiosClient: AxiosClient;
    private static instance: PlaylistService;
    private environmentSettings = environmentSettings();

    private constructor() {
        this.axiosClient = new AxiosClient(String(`${this.environmentSettings.apiUrl}`));
    }

    public static get(): PlaylistService {
        if (!this.instance)
            this.instance = new PlaylistService();
        return this.instance;
    }

    public async getPlaylist(id: string) {
        return await this.axiosClient.get<PlaylistDTO>(`/${this.environmentSettings.playlistsUrl}/${id}`);
    }

    public async createPlaylist(data: CreatePlaylistDTO) {
        return await this.axiosClient.post<PlaylistDTO>(`/${this.environmentSettings.playlistsUrl}/create`, data);
    }

    public async getPlaylists(page:number=0) {
        return await this.axiosClient.get<PlaylistDTO[]>(this.environmentSettings.playlistsUrl,{
            params:{
                page,
                limit:10
            }
        });
    }

    public async checkPlaylistName(name: string) {
        return await this.axiosClient.get<ExistencialQuery>(`${this.environmentSettings.playlistsSearchUrl}/${name}`);
    }

    public async getMyPlaylists(page: number = 0) {
        const url = `/${this.environmentSettings.playlistsUrl}/me`
        return await this.axiosClient.get<PlaylistDTO[]>(url, {
            params: {
                page,
                limit: 10
            }
        });
    }

    public async addTrackToPlaylist(playlistId: string, trackId: string) {
        const url = `${this.environmentSettings.playlistsUrl}/${playlistId}/tracks`;
        return await this.axiosClient.put(`${url}?track_id=${trackId}`);
    }

    public async removeTrackFromPlaylist(playlistId: string, trackId: string) {
        const url = `${this.environmentSettings.playlistsUrl}/${playlistId}/tracks`;
        return await this.axiosClient.delete(`${url}?track_id=${trackId}`);
    }

    public async removePlaylist(playlistId:string){
        const url = `${this.environmentSettings.playlistsUrl}/${playlistId}`;
        return await this.axiosClient.delete(url);
    }

    public async searchPlaylists(pattern:string,page:number=0){
        const url = `${this.environmentSettings.playlistsUrl}`
        return await this.axiosClient.get<PlaylistDTO[]>(url,{
            params:{
                page,
                limit:10,
                pattern,
                search_mode:PlaylistSearchMode.BOTH
            }
        });
    }
}