import { Form } from "react-router";
import type { Route } from "./+types/create_playlist";

export async function clientLoader({ }: Route.ClientLoaderArgs) {

}

export default function CreatePlaylist() {
    return (
        <Form
            method="POST"
            className="flex flex-col h-8/10 m-2 ml-18 justify-start items-center rounded-md bg-[#00000045]"
        >
            <div>
                <input
                    className="outline-none px-1 my-2 bg-[#00000045] rounded-md"
                    type="text"
                    name="playlistname"
                    id="playlistname"
                    placeholder="name" />
            </div>
            <hr className="w-98/100 my-2"/>
            <h1>Creating a playlist</h1>
            <h1>Creating a playlist</h1>
        </Form>
    )
}