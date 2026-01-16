import { Form, redirect, useActionData } from "react-router";
import type { Route } from "./+types/create_playlist";
import { CgAdd } from "react-icons/cg";
import { useRef, useState } from "react";
import type { TrackDTO } from "~/dtos/trackdto";
import AddItem from "~/components/add_item/add_item";
import { UserService } from "~/services/UserService";
import { TrackService } from "~/services/TrackService";
import { PlaylistService } from "~/services/PlaylistService";
import { ROUTES } from "~/routes";

export async function clientLoader({ request }: Route.ClientLoaderArgs) {
    const userService = UserService.get();
    const authenticated = await userService.authenticated();

    if (!authenticated)
        return redirect(ROUTES.LOGIN);
}

export default function CreatePlaylist({ loaderData }: Route.ComponentProps) {

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
            className="flex flex-col h-8/10 m-2 ml-18 justify-start items-center rounded-md bg-[#00000045] overflow-y-auto"
        >
            <input type="file" name="tracks" id="tracks"
                multiple
                onChange={handleFileChanged}
                className="hidden"
                ref={fileInputRef}
            />
            <div className="flex w-full justify-center px-2">
                <input
                    className="flex w-full text-[18px] outline-none px-1 my-2 bg-[#00000045] rounded-md"
                    type="text"
                    name="playlistname"
                    id="playlistname"
                    placeholder="name" />
            </div>
            <hr className="w-98/100 my-2" />
            <div className="flex flex-col h-full w-full justify-center items-center text-[#ffffff65] overflow-y-auto"
                onClick={triggerFileInput}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
            >
                {
                    tracks.length === 0 &&
                    <h1 className="rounded-md p-4 border-dashed border-[1px]">Drag your tracks here</h1>
                }
                {
                    tracks.map((track,index) => {
                        return (
                            <h1>{track.name}</h1>
                        )
                    })
                }
            </div>
            <div onClick={triggerFileInput}>
                <AddItem
                    iconSize={30}
                />
            </div>
        </div>
    )
}