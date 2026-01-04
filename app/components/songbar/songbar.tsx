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
    const [currentTime, setCurrentTime] = useState(0);
    const [muted, setMuted] = useState(false);
    const [source, setSource] = useState(src);
    const [duration, setDuration] = useState("--:--");

    const audioHandler = useRef<HTMLAudioElement>(null);

    const formatTime = (duration?: number) => {
        if (!duration || isNaN(duration) || !isFinite(duration) || duration < 0)
            return "--:--";
        const mins = Math.floor(duration / 60);
        const seconds = Math.floor(duration % 60);
        return `${mins}:${seconds.toString().padStart(2, '0')}`;
    }

    const formatTimeExtended = (duration?: number) => {
        if (!duration || isNaN(duration) || !isFinite(duration) || duration < 0)
            return "--:--";
        const hours = Math.floor(duration / 3600);
        const minutes = Math.floor(Math.floor(duration % 3600) / 60);
        const seconds = Math.floor(Math.floor(duration % 3600) % 60);
        return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }

    useEffect(() => {
        setSource(src);
    }, [src]);

    const handleVolume = (value: number) => {
        if (audioHandler.current) {
            audioHandler.current.volume = value;
        }
        setVolume(value);
    }

    const handlePlay = () => {
        if (playing)
            audioHandler.current?.pause();
        else
            audioHandler.current?.play();
        setPlaying(!playing);
    }

    const getFormattedCurrentTime = (value?: number) => {
        if (value) {
            if (value >= 3600)
                return formatTimeExtended(value);
            else
                return formatTime(value);
        }
        return "--:--";
    }

    const initalizeAudioHandlerProperties = () => {
        setDuration(audioHandler.current && audioHandler.current.duration >= 3600 ?
            formatTimeExtended(audioHandler.current.duration) :
            formatTime(audioHandler.current?.duration)
        );
        handleVolume(volume);
    }

    const handleProgressBarOnMouseUp = () => {
        if (playing)
            audioHandler.current?.play();
    }

    const handleProgressBarValueChanged = (value:number) => {
        if (audioHandler.current){
            audioHandler.current.currentTime = value;
            setCurrentTime(value);
        }
    }

    return (
        <div className="flex flex-col w-full items-center backdrop-blur-xs p-2 pt-7 rounded-md bg-[#ffffff15] gap-2">
            <audio
                ref={audioHandler}
                src={source}
                onLoadedMetadata={initalizeAudioHandlerProperties}
                onTimeUpdate={(e) => setCurrentTime(audioHandler.current?.currentTime ?? 0)}
            ></audio>
            <input
                type="range"
                name="progress"
                id="progress"
                max={audioHandler.current?.duration}
                min={0.0}
                step={0.01}
                value={currentTime}
                onMouseDown={() => audioHandler.current?.pause()}
                onMouseUp={() => handleProgressBarOnMouseUp()}
                onChange={(e) => handleProgressBarValueChanged(parseFloat(e.target.value))}
                className="appearance-none w-full cursor-pointer accent-[#c0c0c0] h-0.25 bg-[#c0c0c0]"
            />
            <div className="flex flex-row justify-between w-full gap-10">
                <small className="flex text-[9px] w-21 justify-center items-center">
                    {getFormattedCurrentTime(currentTime)}/{duration}
                </small>
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
                                handleVolume(0);
                            } else {
                                setMuted(false);
                                handleVolume(0.5);
                            }
                        }}
                        className="hover:bg-[#00000045] p-2 rounded-md cursor-pointer">
                        {
                            muted &&
                            <FaVolumeMute size={20} />
                        }
                        {
                            !muted && volume < 0.5 &&
                            <FaVolumeDown size={20} />
                        }
                        {
                            !muted && volume >= 0.5 &&
                            <FaVolumeUp size={20} />
                        }
                    </div>
                    <input type="range" name="volume" id="volume"
                        max={1.0}
                        min={0.0}
                        step={0.01}
                        value={volume.toString()}
                        onChange={(e) => handleVolume(parseFloat(e.target.value))}
                        className="appearance-none scale-[0.7] accent-[#c0c0c0] w-15 cursor-pointer accent-[#c0c0c0] h-0.25 bg-[#c0c0c0]" />
                </div>
            </div>
        </div>
    )
};

export default SongBar;