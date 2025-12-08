import { MdSkipPrevious,MdSkipNext } from "react-icons/md";
import { IoPlay,IoPause } from "react-icons/io5";

const SongBar = () => {
    return (
        <div className="flex flex-col w-full items-center backdrop-blur-xs p-2 pt-7 rounded-md bg-[#ffffff15] gap-5">
            <input 
            type="range" 
            name="progress" 
            id="progress" 
            className="appearance-none w-full cursor-pointer accent-[#909090] h-0.25 bg-[#909090]"
            />
            <div className="flex flex-row justify-around w-fit gap-10">
                <div>
                    <MdSkipPrevious size={30}/>
                </div>
                <div>
                    <IoPlay size={30}/>
                </div>
                <div>
                    <MdSkipNext size={30}/>
                </div>
            </div>
        </div>
    )
};

export default SongBar;