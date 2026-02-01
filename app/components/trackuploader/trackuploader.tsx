import { PlaylistService } from "~/services/PlaylistService";
import { TrackService } from "~/services/TrackService";
import AddItem from "../add_item/add_item";
import { TrackToUpload, type TrackToUploadRef } from "../track_to_upload/track_to_upload";
import { ROUTES } from "~/routes";
import { useNavigate } from "react-router";
import { useCallback, useRef, useState } from "react";

interface TrackUploaderProps {
    playlistId?: string;
}

export default function TrackUploader({ playlistId }: TrackUploaderProps) {
    const playlistService = playlistId ? PlaylistService.get() : null;
    const trackService = TrackService.get();

    const [tracks, setTracks] = useState<File[]>([]);
    const [isDragging, setIsDragging] = useState(false);
    const tracksRef = useRef<(TrackToUploadRef | null)[]>([]);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const setTrackRef = useCallback((index:number) => {
        return (el:TrackToUploadRef | null) => {
            tracksRef.current[index] = el;
        };
    },[]);

    const navigate = useNavigate();

    const uploadTrack = async (trackName: string, authorName: string, file: File) => {
        const formData = new FormData();

        formData.append('data', file as Blob);

        const uploadResponse = await trackService.uploadTrack(trackName, authorName, formData);

        if (uploadResponse.status === 201 && playlistService !== null && playlistId) {
            const trackId = uploadResponse.data.id;
            playlistService.addTrackToPlaylist(playlistId, trackId);
            return true;
        }
        if (uploadResponse.status === 401)
            navigate(ROUTES.LOGIN);
        return false;
    }

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(true);
    };

    const handleDragLeave = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);

        const droppedTracks = Array.from(e.dataTransfer.files);
        setTracks(prev => [...prev, ...droppedTracks]);
    };

    const handleFileChanged = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const selectedTracks = Array.from(e.target.files);
            setTracks(prev => [...prev, ...selectedTracks]);
        }
    };

    const removeTrack = async (index: number, uploaded: boolean = false) => {
        if (uploaded) {
            console.log('Not implemented');
        }
        setTracks(prev => prev.filter((_, i) => i !== index));
    };

    const triggerFileInput = () => {
        fileInputRef.current?.click();
    }

    const uploadAllTracks = () => {
        tracksRef.current.forEach(ref => ref?.handleClick());
    }

    return (
        <div
            className="flex flex-col h-22/25 mt-2 mr-2 ml-18 justify-start items-center rounded-md bg-[#00000045] overflow-y-auto"
        >
            <input type="file" name="tracks" id="tracks"
                multiple
                onChange={handleFileChanged}
                className="hidden"
                ref={fileInputRef}
            />
            <div className="flex flex-col h-full pt-10 w-full justify-center items-center text-[#ffffff65]
            overflow-y-auto
                    
            [&::-webkit-scrollbar]:w-2
            [&::-webkit-scrollbar-track]:rounded-full
            [&::-webkit-scrollbar-thumb]:bg-[#00000035]
            [&::-webkit-scrollbar-thumb]:rounded-full
            [&::-webkit-scrollbar-thumb:hover]:bg-[#00000065]
            [&::-webkit-scrollbar-thumb:hover]:cursor-pointer

            scrollbar-thin
            scrollbar-thumb-gray-400
            scrollbar-track-gray-100
            scrollbar-track-rounded
            scrollbar-thumb-rounded
            "
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
            >
                {
                    tracks.length === 0 &&
                    <h1 className="rounded-md p-4 border-dashed border-[1px]">Drag your tracks here</h1>
                }
                {
                    tracks.map((track, index) => {
                        return (
                            <TrackToUpload
                                ref={setTrackRef(index)}
                                track={track}
                                track_index={index}
                                key={index}
                                onDelete={(uploaded: boolean) => removeTrack(index, uploaded)}
                                uploadTrack={uploadTrack}
                            />
                        )
                    })
                }
            </div>
            <div className="flex flex-row justify-around items-center">
                <div onClick={triggerFileInput}>
                    <AddItem
                        width={150}
                        iconSize={30}
                        text="add from local"
                    />
                </div>
                <div
                    onClick={() => navigate('add_from_cloud/0')}
                >
                    <AddItem
                        width={150}
                        iconSize={30}
                        text="add from cloud"
                    />
                </div>
            </div>
            {
                tracks.length !== 0 &&
                <button onClick={uploadAllTracks}
                    className="rounded-md p-1 px-5 bg-[#ffffff15] cursor-pointer hover:bg-[#00000045] duration-500 fixed bottom-5 right-5">
                    Upload
                </button>
            }
        </div>
    )
}