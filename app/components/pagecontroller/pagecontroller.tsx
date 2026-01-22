import { MdNavigateNext } from "react-icons/md";
import { MdNavigateBefore } from "react-icons/md";

interface PageControllerInput {
    currentPage: number;
    nextPage: boolean;
    onNext: () => void;
    onPrev: () => void;
}

export default function PageController({ nextPage, currentPage, onNext, onPrev }: PageControllerInput) {
    return (
        <div className="flex flex-row w-fit gap-3 px-2">
            <div
                className={`
                        flex justify-center items-center p-1 rounded-md bg-[#ffffff25]
                        ${currentPage > 0 && "cursor-pointer hover:bg-[#00000045] duration-500"}
                        ${currentPage === 0 && "text-[#ffffff35]"}
                        `} onClick={onPrev}>
                <MdNavigateBefore size={20} />
            </div>
            <div className="p-1 px-3 rounded-md bg-[#ffffff25]">
                <small>{currentPage}</small>
            </div>
            <div
                className={`
                        flex justify-center items-center p-1 rounded-md bg-[#ffffff25]
                        ${nextPage && "cursor-pointer hover:bg-[#00000045] duration-500"}
                        ${!nextPage && "text-[#ffffff35]"}
                        `}
                onClick={onNext}>
                <MdNavigateNext size={20} />
            </div>
        </div>
    )
}