import { useState } from "react";
import EditableField from "../editablefield/editablefield";
import { RiDeleteBin6Line } from "react-icons/ri";
import { HiUpload } from "react-icons/hi";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { FaRedoAlt } from "react-icons/fa";
import { MdEdit, MdDone } from "react-icons/md";

interface TrackToUploadInput {
    track: File;
    track_index: number;
    onDelete: (uploaded:boolean) => void;
    uploadTrack: (trackName: string, author: string, data: File) => Promise<boolean>;
}

enum UploadState {
    START,
    PENDING,
    FAILED,
    DONE
}

export default function TrackToUpload({ track, track_index, onDelete, uploadTrack }: TrackToUploadInput) {

    const [trackName, setTrackName] = useState(track.name);
    const [authorName, setAuthorName] = useState("");

    const [trackNameValid, setTrackNameValid] = useState(false);
    const [authorNameValid, setAuthorNameValid] = useState(false);

    const [uploadState, setUploadState] = useState<UploadState>(UploadState.START);

    const handleUploadTrack = () => {
        setUploadState(UploadState.PENDING);
        uploadTrack(trackName, authorName, track).then(resp => resp ?
            setUploadState(UploadState.DONE) :
            setUploadState(UploadState.FAILED)
        ).catch(err => setUploadState(UploadState.FAILED));
    }

    const validateInput = (input: string, callback: (value: boolean | ((prevState: boolean) => boolean)) => void) => {
        const pattern = /^[a-zA-Z0-9\s]+$/;
        const result = pattern.test(input);
        callback(result);
    }

    return (
        <div className="flex flex-row  flex-wrap gap-3 justify-around items-center w-98/100 text-[#ffffffa5] my-2 rounded-md bg-[#00000045] mx-1 p-1">
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
                <button onClick={() => onDelete(uploadState === UploadState.DONE)} className="cursor-pointer hover:bg-[#00000065] duration-500 p-1 rounded-md">
                    <RiDeleteBin6Line size={30} />
                </button>
                <button
                    disabled={!(trackNameValid && authorNameValid) || uploadState === UploadState.DONE}
                    onClick={handleUploadTrack}
                    className={`${trackNameValid && authorNameValid && uploadState !== UploadState.DONE && "outline-none cursor-pointer hover:bg-[#00000065]"} duration-500 rounded-md p-1 
                    ${(!(trackNameValid && authorNameValid) || uploadState === UploadState.DONE) && "text-[#ffffff45]"}
                    `}>
                    <div style={{
                        animation: uploadState === UploadState.PENDING ? "loadingAnimation 1.5s linear infinite" : ''
                    }}>
                        {
                            uploadState === UploadState.START &&
                            <HiUpload size={30} />
                        }
                        {
                            uploadState === UploadState.PENDING &&
                            <AiOutlineLoading3Quarters size={25} />
                        }
                        {
                            uploadState === UploadState.FAILED &&
                            <FaRedoAlt size={25} />
                        }
                        {
                            uploadState === UploadState.DONE &&
                            <MdDone size={25} />
                        }
                    </div>
                </button>
            </div>
        </div>
    )
}