import { FaHeart } from "react-icons/fa";
import { AiFillLike, AiFillDislike } from "react-icons/ai";
import { IoPlay } from "react-icons/io5";

export interface SocialControlsInterface {
    likes?: number
    dislikes?: number
    reproductions?: number
    hearts?: number
}

const SocialStats = ({ hearts, likes, dislikes, reproductions }: SocialControlsInterface) => {
 
    const formatStats = (stat:number):string => {
        if (stat < 1000)
            return `${stat}`;
        if (stat < 1000000)
            return `${Math.floor(stat / 1000)}K`;
        if (stat < 1000000000)
            return `${Math.floor(stat / 1000000)}M`;
        return `${stat / 1000000000}kM`
    }

    return (
        <div className="flex flex-row justify-bettwen gap-3 w-full mt-3">
            <div className="flex flex-row gap-1 w-10 items-center">
                <FaHeart size={15} />
                <small className="text-[10px]">{`${hearts ? formatStats(hearts) : 0}`}</small>
            </div>
            <div className="flex flex-row gap-1 w-10 items-center">
                <AiFillLike size={15} />
                <small className="text-[10px]">{`${likes ? formatStats(likes) : 0}`}</small>
            </div>
            <div className="flex flex-row gap-1 w-10 items-center">
                <AiFillDislike size={15} />
                <small className="text-[10px]">{`${dislikes ? formatStats(dislikes) : 0}`}</small>
            </div>
            <div className="flex flex-row gap-1 w-10 items-center">
                <IoPlay size={15} />
                <small className="text-[10px]">{`${reproductions ? formatStats(reproductions) : 0}`}</small>
            </div>
        </div>
    )
};

export default SocialStats;