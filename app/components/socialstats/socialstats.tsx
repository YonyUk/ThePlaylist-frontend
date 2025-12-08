import { FaHeart,FaRegHeart } from "react-icons/fa";
import { AiFillLike, AiOutlineLike, AiFillDislike, AiOutlineDislike } from "react-icons/ai";
import { IoPlay, IoPause } from "react-icons/io5";
import { useState } from "react";

export interface SocialControlsInterface {
    interactive?:boolean
    likes?: number
    dislikes?: number
    reproductions?: number
    hearts?: number
    valued?:boolean
    stat?:'loved' | 'liked' | 'disliked' | 'none'
}

const SocialStats = ({ hearts, likes, dislikes, reproductions, interactive,valued, stat }: SocialControlsInterface) => {
 
    const [liked,setLiked] = useState(false);
    const [loved,setLoved] = useState(false);
    const [disliked,setDisliked] = useState(false);
    const [currentHearts,setCurrentHearts] = useState(hearts ? hearts : 0);
    const [currentLikes,setCurrentLikes] = useState(likes ? likes : 0);
    const [currentDislikes,setCurrentDislikes] = useState(dislikes ? dislikes : 0);
    const [isValued,setIsValued] = useState(valued ? valued : false);
    const [statSelected,setStatSelected] = useState(stat? stat : 'none');
    const isInteractive = interactive ? interactive : false

    const formatStats = (stat:number):string => {
        if (stat < 1000)
            return `${stat}`;
        if (stat < 1000000)
            return `${Math.floor(stat / 1000)}K`;
        if (stat < 1000000000)
            return `${Math.floor(stat / 1000000)}M`;
        return `${stat / 1000000000}kM`
    };

    const updateStat = (
        stat:'loved' | 'liked' | 'disliked',
        affect:boolean,
        value:number,
        statUpdater:(v:number | ((prevState:number) => number)) => void,
        indicatorUpdater:(v:boolean | ((prevState:boolean) => boolean)) => void
    ) => {
        if (!affect)
            return;
        if (!isValued){
            statUpdater(value + 1);
            indicatorUpdater(true);
            setIsValued(true);
            setStatSelected(stat);
        } else{
            statUpdater(value - 1);
            indicatorUpdater(false);
            setIsValued(false);
            setStatSelected('none');
        }
    };

    return (
        <div className="flex flex-row justify-bettwen gap-3 w-full mt-3">
            <div
            onClick={
                () => updateStat(
                    'loved',
                    statSelected === 'loved' || statSelected === 'none',
                    currentHearts,
                    setCurrentHearts,
                    setLoved
                )
            } 
            className={`flex flex-row gap-1 w-10 items-center ${isInteractive && 'cursor-pointer' }`}>
                {!interactive && <FaHeart size={15}/>}
                {interactive &&
                (loved ? <FaHeart size={15}/> : <FaRegHeart size={15}/>)
                }
                <small className="text-[10px]">{`${formatStats(currentHearts)}`}</small>
            </div>
            <div
            onClick={
                () => updateStat(
                    'liked',
                    statSelected==='liked' || statSelected === 'none',
                    currentLikes,
                    setCurrentLikes,
                    setLiked
                )
            } 
            className={`flex flex-row gap-1 w-10 items-center ${isInteractive && 'cursor-pointer' }`}>
                {!interactive && <AiFillLike size={15}/>}
                {interactive &&
                (liked ? <AiFillLike size={15}/> : <AiOutlineLike size={15}/>)
                }
                <small className="text-[10px]">{`${formatStats(currentLikes)}`}</small>
            </div>
            <div
            onClick={
                () => updateStat(
                    'disliked',
                    statSelected==='disliked' || statSelected==='none',
                    currentDislikes,
                    setCurrentDislikes,
                    setDisliked
                )
            } 
            className={`flex flex-row gap-1 w-10 items-center ${isInteractive && 'cursor-pointer' }`}>
                {!interactive && <AiFillDislike size={15}/>}
                {interactive &&
                (disliked ? <AiFillDislike size={15}/> : <AiOutlineDislike size={15}/>)
                }
                <small className="text-[10px]">{`${formatStats(currentDislikes)}`}</small>
            </div>
            <div className="flex flex-row gap-1 w-10 items-center">
                <IoPlay size={15} />
                <small className="text-[10px]">{`${reproductions ? formatStats(reproductions) : 0}`}</small>
            </div>
        </div>
    )
};

export default SocialStats;