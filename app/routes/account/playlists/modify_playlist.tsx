import { redirect, useActionData, useNavigate } from "react-router";
import { useRef, useState } from "react";
import AddItem from "~/components/add_item/add_item";
import TrackToUpload from "~/components/track_to_upload/track_to_upload";
import { TrackService } from "~/services/TrackService";
import { PlaylistService } from "~/services/PlaylistService";
import type { Route } from "./+types/modify_playlist";
import { UserService } from "~/services/UserService";
import { ROUTES } from "~/routes";

export async function clientLoader({ params }: Route.ClientLoaderArgs) {
    const service = UserService.get();

    const authenticated = await service.authenticated();
    if (!authenticated)
        return redirect(ROUTES.LOGIN);
    const playlistId = params.playlistId;
    return playlistId;
}

export default function ModifyPlaylist({ loaderData }: Route.ComponentProps) {
    const trackService = TrackService.get();
    const playlistService = PlaylistService.get();

    const playlistId = loaderData;

    const [tracks, setTracks] = useState<File[]>([]);
    const [isDragging, setIsDragging] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const actionData = useActionData();

    const navigate = useNavigate();

    const uploadTrack = async (trackName: string, authorName: string, file: File) => {
        const formData = new FormData();

        formData.append('data', file as Blob);

        const uploadResponse = await trackService.uploadTrack(trackName, authorName, formData);

        if (uploadResponse.status === 200) {
            const trackId = uploadResponse.data.id;
            const addResponse = await playlistService.addTrackToPlaylist(playlistId, trackId);
            return addResponse.status === 200;
        }
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
        if (uploaded){
            console.log('Not implemented');
        }
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
                                onDelete={(uploaded:boolean) => removeTrack(index,uploaded)}
                                uploadTrack={uploadTrack}
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
                <div
                    onClick={() => navigate('add_from_cloud/0')}
                >
                    <AddItem
                        iconSize={30}
                        text="add from cloud"
                    />
                </div>
            </div>
        </div>
    )
}