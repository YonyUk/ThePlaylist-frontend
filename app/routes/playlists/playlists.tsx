import { useState } from "react";
import PlayListItem from "~/components/playlist/playlist";
import SearchBar from "~/components/searchbar/searchbar";
import type { PlayList } from "~/types/playlist";
import type { Route } from "./+types/playlists";
import { redirect } from "react-router";
import { ROUTES } from "~/routes";
import { UserService } from "~/services/UserService";

export async function clientLoader({params}:Route.ClientLoaderArgs){
    const service = UserService.get();
    if (!service.authenticated())
        return redirect(ROUTES.LOGIN);
    return null;
}

export default function PlayLists({loaderData}:Route.ComponentProps) {

    const id = 'nada';
    const name = 'nada';
    const img = 'app/assets/images/background.jpg';
    const songs = 0;
    const author = 'nadie';
    const reproductions = 0

    const playlist: PlayList = {
        id,
        name,
        img,
        author,
        songs,
        reproductions
    };

    const [playLists, setPlayLists] = useState<PlayList[]>([playlist]);
    // const [playLists,setPlayLists] = useState<PlayList[]>([]);

    return (
        <div className="p-3 pl-18 gap-5 flex flex-col h-screen w-full items-center">
            <SearchBar />
            <div className={`flex ${playLists.length !== 0 ?
                'flex-wrap bg-[#00000045] w-full px-5 py-2 overflow-auto' : 
                'flex-col h-full justify-center'}
                rounded-md justify-items-start`}>
                {
                    playLists.length === 0 &&
                    <div className='bg-[#00000045] rounded-md p-10 flex flex-row self-center
                        justify-self-center'>
                        <h1 className="text-[30px]">No playlists</h1>
                    </div>
                }
                {
                    playLists.map((item,index) => {
                        return (
                            <PlayListItem
                            key={index}
                            id={item.id}
                            name={item.name}
                            img={item.img}
                            songs={item.songs}
                            author={item.author}
                            reproductions={item.reproductions}
                            />
                        )
                    })
                }
            </div>
        </div>
    )

};