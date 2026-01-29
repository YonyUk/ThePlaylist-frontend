import { MdSkipPrevious, MdSkipNext } from "react-icons/md";
import { IoPlay, IoPause } from "react-icons/io5";
import { FaVolumeDown, FaVolumeMute, FaVolumeUp } from "react-icons/fa";
import { useEffect, useRef, useState } from "react";

interface SongBarInput {
    src?: string;
    play: boolean;
    onPlay?: () => void;
    onNext?: (keepPlay: boolean) => void;
    onPrev?: (keepPlay: boolean) => void;
}

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

const getFormattedCurrentTime = (value?: number) => {
    if (value) {
        if (value >= 3600)
            return formatTimeExtended(value);
        else
            return formatTime(value);
    }
    return "--:--";
}

const SongBar = ({ src, play, onNext, onPrev, onPlay }: SongBarInput) => {
    const [playing, setPlaying] = useState(play);
    const [volume, setVolume] = useState(0.5);
    const [currentTime, setCurrentTime] = useState(0);
    const [muted, setMuted] = useState(false);
    const [source, setSource] = useState(src);
    const [duration, setDuration] = useState("--:--");
    const [played, setPlayed] = useState(false);

    const audioHandler = useRef<HTMLAudioElement>(null);

    useEffect(() => {
        setSource(src);
        setPlayed(false);
    }, [src]);

    const handleVolume = (value: number) => {
        if (audioHandler.current) {
            audioHandler.current.volume = value;
        }
        setVolume(value);
    }

    const handlePlay = () => {
        if (!played) {
            if (onPlay)
                onPlay();
            setPlayed(true);
        }
        if (playing)
            audioHandler.current?.pause();
        else
            audioHandler.current?.play();
        setPlaying(!playing);
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

    const handleProgressBarValueChanged = (value: number) => {
        if (audioHandler.current) {
            audioHandler.current.currentTime = value;
            setCurrentTime(value);
        }
    }

    return (
        <div className="flex flex-col w-full items-center backdrop-blur-xs p-2 pt-7 rounded-md bg-[#ffffff15] gap-2">
            <audio
                ref={audioHandler}
                src={source}
                autoPlay={playing}
                onEnded={() => {
                    if (onNext)
                        onNext(playing);
                }}
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
                className="appearance-none w-full cursor-pointer accent-[#c0c0c0] h-0.25 bg-[#c0c0c0] outline-none"
            />
            <div className="flex flex-row justify-between w-full gap-10">
                <small className="flex text-[9px] w-21 justify-center items-center">
                    {currentTime ? getFormattedCurrentTime(currentTime) : '00:00'}/{duration}
                </small>
                <div className="flex flex-row justify-around items-center w-fit gap-3">
                    <button disabled={!onPrev}
                    className={`
                        rounded-md ${onPrev && "hover:bg-[#00000045] cursor-pointer"} duration-500
                        ${!onPrev && "text-[#ffffff65]"}
                    `}
                        onClick={() => {
                            if (onPrev) {
                                onPrev(playing);
                            }
                        }}>
                        <MdSkipPrevious size={20} />
                    </button>
                    <button disabled={!onPlay}
                    className={`
                    rounded-md ${onPlay && "cursor-pointer hover:bg-[#00000045]"} duration-500
                    ${!onPlay && "text-[#ffffff65"}
                    `}
                        onClick={() => handlePlay()}>
                        {playing ? <IoPause size={20} /> : <IoPlay size={20} />}
                    </button>
                    <button disabled={!onNext}
                    className={`
                        rounded-md ${onNext && "hover:bg-[#00000045] cursor-pointer"} duration-500
                        ${!onNext && "text-[#ffffff65]"}
                    `}
                        onClick={() => {
                            if (onNext) {
                                onNext(playing);
                            }
                        }}>
                        <MdSkipNext size={20} />
                    </button>
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
                        className="outline-none appearance-none scale-[0.7] accent-[#c0c0c0] w-15 cursor-pointer accent-[#c0c0c0] h-0.25 bg-[#c0c0c0]" />
                </div>
            </div>
        </div>
    )
};

export default SongBar;