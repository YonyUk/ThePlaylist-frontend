import { MdSkipPrevious, MdSkipNext } from "react-icons/md";
import { IoPlay, IoPause } from "react-icons/io5";
import { FaVolumeDown, FaVolumeMute, FaVolumeUp } from "react-icons/fa";
import { useEffect, useRef, useState } from "react";

interface SongBarInput {
    src?: string
}

const SongBar = ({ src }: SongBarInput) => {
    const [playing, setPlaying] = useState(false);
    const [volume, setVolume] = useState(0.5);
    const [muted, setMuted] = useState(false);
    const [source,setSource] = useState(src ?? "");
    const [duration,setDuration] = useState("");

    const audioHandler = useRef<HTMLAudioElement>(null);

    const formatTime = (duration?:number) => {
        if (!duration || isNaN(duration) || !isFinite(duration) || duration < 0)
            return "0:00";
        const mins = Math.floor(duration / 60);
        const seconds = Math.floor(duration % 60);
        return `${mins}:${seconds.toString().padStart(2,'0')}`;
    }

    useEffect(() => {
        setSource(src ?? "");
        setDuration(formatTime(audioHandler.current?.duration))
    },[src])

    const handlePlay = () => {
        if (playing)
            audioHandler.current?.pause();
        else
            audioHandler.current?.play();
        setPlaying(!playing);
    }

    return (
        <div className="flex flex-col w-full items-center backdrop-blur-xs p-2 pt-7 rounded-md bg-[#ffffff15] gap-2">
            <audio
            ref={audioHandler} 
            src={source}></audio>
            <input
                type="range"
                name="progress"
                id="progress"
                className="appearance-none w-full cursor-pointer accent-[#c0c0c0] h-0.25 bg-[#c0c0c0]"
            />
            <div className="flex flex-row justify-between w-full gap-10">
                <small className="flex text-[9px] w-21 justify-center items-center">00:00/{duration}</small>
                <div className="flex flex-row justify-around items-center w-fit gap-3">
                    <div className="cursor-pointer rounded-md hover:bg-[#00000045] duration-500">
                        <MdSkipPrevious size={20} />
                    </div>
                    <div className="cursor-pointer rounded-md hover:bg-[#00000045] duration-500"
                        onClick={() => handlePlay()}>
                        {playing ? <IoPause size={20} /> : <IoPlay size={20} />}
                    </div>
                    <div className="cursor-pointer rounded-md hover:bg-[#00000045] duration-500">
                        <MdSkipNext size={20} />
                    </div>
                </div>
                <div className="flex flex-row justify-around items-center w-fit">
                    <div
                        onClick={() => {
                            if (volume !== 0) {
                                setMuted(true);
                                setVolume(0)
                            } else {
                                setMuted(false);
                                setVolume(50);
                            }
                        }}
                        className="hover:bg-[#00000045] p-2 rounded-md cursor-pointer">
                        {
                            muted &&
                            <FaVolumeMute size={20} />
                        }
                        {
                            !muted && volume < 50 &&
                            <FaVolumeDown size={20} />
                        }
                        {
                            !muted && volume >= 50 &&
                            <FaVolumeUp size={20} />
                        }
                    </div>
                    <input type="range" name="volume" id="volume"
                        value={volume.toString()}
                        onChange={(e) => setVolume(parseFloat(e.target.value))}
                        className="appearance-none scale-[0.7] accent-[#c0c0c0] w-15 cursor-pointer accent-[#c0c0c0] h-0.25 bg-[#c0c0c0]" />
                </div>
            </div>
        </div>
    )
};

export default SongBar;