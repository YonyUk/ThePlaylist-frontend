import { Form, redirect, useActionData } from "react-router";
import { CgAdd } from "react-icons/cg";
import { useRef, useState } from "react";
import type { TrackDTO } from "~/dtos/trackdto";
import AddItem from "~/components/add_item/add_item";
import { UserService } from "~/services/UserService";
import { TrackService } from "~/services/TrackService";
import { PlaylistService } from "~/services/PlaylistService";
import { ROUTES } from "~/routes";
import TrackToUpload from "~/components/track_to_upload/track_to_upload";

export default function ModifyPlaylist() {

    const [tracks, setTracks] = useState<File[]>([]);
    const [isDragging, setIsDragging] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const actionData = useActionData();

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

    const removeTrack = (index: number) => {
        setTracks(prev => prev.filter((_, i) => i !== index));
    };

    const triggerFileInput = () => {
        fileInputRef.current?.click();
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
            <div className="flex flex-col h-full w-full justify-center items-center text-[#ffffff65] overflow-y-auto"
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
                                track={track}
                                track_index={index}
                                key={index}
                                onDelete={() => removeTrack(index)}
                            />
                        )
                    })
                }
            </div>
            <div className="flex flex-row justify-around items-center">
                <div onClick={triggerFileInput}>
                    <AddItem
                        iconSize={30}
                        text="add from local"
                    />
                </div>
                <div>
                    <AddItem
                        iconSize={30}
                        text="add from cloud"
                    />
                </div>
            </div>
        </div>
    )
}