import type { Song } from "~/types/song";
import "./song.css"

export default function SongItem({id,name,author,likes,dislikes,img}:Song) {
    return (
        <div className="song-item glass-box">
            <img src={img}/>
            <div className="song-name-header">
                <h5>{name}</h5>
                <h5><small>{author}</small></h5>
            </div>
            <input className="song-timeline" 
            type="range" 
            name="song-current-time" 
            id={`${id}-song-current-time`} />
            <div className="song-item-controls ">
                <button type="button">{"<"}</button>
                <button type="button">{">II"}</button>
                <button type="button">{">"}</button>
            </div>
            <div className="song-social-info">
                <button type="button">like</button>
                <button type="button">dislike</button>
            </div>
        </div>
    );
}