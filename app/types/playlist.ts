import type { Song } from "./song"

export interface PlayList
{
    id:string
    name:string
    songs:Song[]
}