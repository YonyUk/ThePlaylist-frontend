import type { Song } from "~/types/song";

const CurrentSong = ({name,img}:Song) => {
    return (
        <div className="flex flex-col gap-2 p-3 w-50 h-65 bg-[#00000045] rounded-md items-center">
            <h1>{name}</h1>
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
        </div>
    )
};

export default CurrentSong;