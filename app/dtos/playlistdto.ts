import type { TrackDTO } from "./trackdto";

export interface PlaylistDTO {
    id:string;
    name:string;
    description:string;
    likes:number;
    dislikes:number;
    plays:number;
    loves:number;
    author_id:number;
    author:string;
    tracks:TrackDTO[];
}

export interface CreatePlaylistDTO {
    name:string;
    description:string;
}

export interface UpdatePlaylistInfoDTO {
    name:string;
    description:string;
}