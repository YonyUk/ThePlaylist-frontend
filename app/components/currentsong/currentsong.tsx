import type { Song } from "~/types/song";
import SocialStats from "../socialstats/socialstats";

const CurrentSong = ({name,img,author}:Song) => {
    
    const nameOffset = (name.length / 2) * 15;
    const authorOffset = (author.length / 2) * 13.28;

    const nameAnimationStyle = {
        animation : `scrollNameLeft ${5 * (name.length / 4)}s linear infinite`
    };

    const authorAnimationStyle = {
        animation: `scrollAuthorLeft ${5 * (author.length / 4)}s linear infinite`
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
            <div className="flex flex-row justify-center w-full text-[15px] overflow-hidden  px-3">
                {name.length >= 21 && <h1 style={nameAnimationStyle}>{name}</h1>}
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
                {author.length >= 25 && <h1 style={authorAnimationStyle}>{author}</h1>}
                {author.length < 25 && <h1>{author}</h1>}
            </div>
            <SocialStats/>
        </div>
    )
};

export default CurrentSong;