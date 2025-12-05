import { useState,useRef,useEffect } from "react";

function useAudioPlayer(audioSrc:string) {
    const [isPlaying,setIsPlaying] = useState(false);
    const [currentTime,setCurrentTime] = useState(0);
    return {isPlaying,currentTime};
}