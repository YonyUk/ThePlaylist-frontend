import type { Song } from "~/types/song";
import type { Route } from "./+types/home";
import SongItem from "~/components/song/song";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "New React Router App" },
    { name: "description", content: "Welcome to React Router!" },
  ];
}

export default function Home() {
  let song:Song = {
    id:'1',
    name:'name',
    author:'author',
    likes:0,
    dislikes:0,
    img:'app/assets/images/background.jpg',
    src:''
  }
  return (
    <h1>hello world</h1>
  );
}
