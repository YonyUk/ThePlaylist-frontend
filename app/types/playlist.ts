import type { Song } from "./song"

export interface PlayList
{
    id:string
    name:string
    songs:Song[]
    img:string
    author:string
    reproductions?:number
    likes?:number
    dislikes?:number
}