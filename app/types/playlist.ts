import type { Song } from "./song"

export interface PlayList
{
    id:string
    name:string
    songs:number
    img:string
    author:string
    reproductions?:number
    likes?:number
    dislikes?:number
}