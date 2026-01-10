export interface TrackDTO {
    id:string;
    likes:number;
    dislikes:number;
    loves:number;
    plays:number;
    author_name:string;
    name:string;
    img?:string;
}

export interface TrackUpdateDTO {
    likes:number;
    dislikes:number;
    loves:number;
    plays:number;
}