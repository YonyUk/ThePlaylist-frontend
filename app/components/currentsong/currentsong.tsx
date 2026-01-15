import type { TrackDTO } from "~/dtos/trackdto";
import SocialStats from "../socialstats/socialstats";

interface CurrentSongInput extends TrackDTO {
    liked?: boolean;
    disliked?: boolean;
    loved?: boolean;
    onLiked: (value:boolean) => void;
    onDisliked: (value:boolean) => void;
    onLoved: (value:boolean) => void;
}

const CurrentSong = (
    {
        name,
        img,
        author_name,
        plays,
        likes,
        dislikes,
        loves,
        liked,
        disliked,
        loved,
        onLiked,
        onDisliked,
        onLoved
    }: CurrentSongInput
) => {

    const nameOffset = (name.length / 2) * 15;
    const authorOffset = (author_name.length / 2) * 13.28;

    const valued = liked === true || disliked === true || loved === true;
    const stat = liked === true ?
        'liked' : disliked === true ?
            'disliked' : loved === true ?
                'loved' : 'none';

    const nameAnimationStyle = {
        animation: `scrollNameLeft ${5 * (name.length / 4)}s linear infinite`
    };

    const authorAnimationStyle = {
        animation: `scrollAuthorLeft ${5 * (author_name.length / 4)}s linear infinite`
    };

    return (
        <div className="flex flex-col gap-2 p-3 w-50 h-65 bg-[#00000045] rounded-md items-center overflow-hidden">
            <style>
                {
                    `
                @keyframes scrollNameLeft {
                    0%{ transform: translateX(${50 + nameOffset}px); }
                    100%{ transform: translateX(-${50 + nameOffset}px); }
                }
                
                @keyframes scrollAuthorLeft {
                    0%{ transform: translateX(${45 + authorOffset}px); }
                    100%{ transform: translateX(-${45 + authorOffset}px); }
                }
                `
                }
            </style>
            {/* Name header*/}
            <div className="flex flex-row justify-center w-max text-[15px] overflow-hidden">
                {name.length >= 21 && <div><h1 style={nameAnimationStyle as React.CSSProperties}>{name}</h1></div>}
                {name.length < 21 && <h1>{name}</h1>}
            </div>
            {
                img &&
                <img src={img} alt={`song-${name}-img`}></img>
            }
            {
                !img &&
                <div className="flex h-[60%] w-full bg-[#00000025] justify-center items-center rounded-md">
                    <h1>No image</h1>
                </div>
            }
            {/* Author header*/}
            <div className="flex flex-row justify-center w-full text-[12px] overflow-hidden px-3">
                {author_name.length >= 25 && <h1 style={authorAnimationStyle}>{author_name}</h1>}
                {author_name.length < 25 && <h1>{author_name}</h1>}
            </div>
            <SocialStats interactive={true}
                likes={likes}
                dislikes={dislikes}
                hearts={loves}
                reproductions={plays}
                already_liked={liked}
                already_disliked={disliked}
                already_loved={loved}
                valued={valued}
                stat={stat}
                onLiked={onLiked}
                onDisliked={onDisliked}
                onLoved={onLoved}
            />
        </div>
    )
};

export default CurrentSong;