import { useState } from "react";
import EditableField from "../editablefield/editablefield";
import { RiDeleteBin6Line } from "react-icons/ri";
import { HiUpload } from "react-icons/hi";
import { AiOutlineLoading3Quarters } from "react-icons/ai";

interface TrackToUploadInput {
    track: File;
    track_index: number;
    onDelete: () => void;
}

export default function TrackToUpload({ track, track_index, onDelete }: TrackToUploadInput) {
    const [trackName, setTrackName] = useState(track.name);
    const [authorName, setAuthorName] = useState("");

    const [trackNameValid, setTrackNameValid] = useState(false);
    const [authorNameValid, setAuthorNameValid] = useState(false);

    const validateInput = (input: string, callback: (value: boolean | ((prevState: boolean) => boolean)) => void) => {
        const pattern = /^[a-zA-Z0-9\s]+$/;
        const result = pattern.test(input);
        callback(result);
    }

    return (
        <div className="flex flex-row gap-3 justify-around items-center w-98/100 text-[#ffffffa5] my-2 rounded-md bg-[#00000045] mx-1 p-1">
            <div className="flex flex-col">
                <h1>Name: </h1>
                <EditableField
                    type="text"
                    name="trackName"
                    valid={trackNameValid}
                    invalidDescription="track name must only contains alphanumeric characters and whitespaces"
                    id={`${track_index}-name`}
                    onEditCallback={setTrackName}
                    onEditEnd={() => validateInput(trackName, setTrackNameValid)}
                    value={trackName}
                />
            </div>
            <div className="flex flex-col">
                <h1>Author Name: </h1>
                <EditableField
                    type="text"
                    name="authorName"
                    valid={authorNameValid}
                    invalidDescription="author name must only contains alphanumeric characters and whitespaces"
                    id={`${track_index}-author`}
                    onEditCallback={setAuthorName}
                    onEditEnd={() => validateInput(authorName, setAuthorNameValid)}
                    value={authorName}
                />
            </div>
            <div className="flex flex-row gap-5">
                <div onClick={onDelete} className="cursor-pointer hover:bg-[#00000065] duration-500 p-1 rounded-md">
                    <RiDeleteBin6Line size={30} />
                </div>
                <div className={`${trackNameValid && authorNameValid && "cursor-pointer hover:bg-[#00000065]"} duration-500 rounded-md p-1 
                    ${!(trackNameValid && authorNameValid) && "text-[#ffffff45]"}
                    `}>
                    <HiUpload size={30} />
                </div>
            </div>
        </div>
    )
}