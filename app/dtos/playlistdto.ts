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
    tracks:string[];
}