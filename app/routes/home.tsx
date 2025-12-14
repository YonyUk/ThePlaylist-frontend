import SideBar from "~/components/sidebar/sidebar";
import type { Route } from "./+types/home";

export function meta({ }: Route.MetaArgs) {
  return [
    { title: "New React Router App" },
    { name: "description", content: "Welcome to React Router!" },
  ];
}

export default function Home() {
  return (
    <div className="pl-18">
      <h1>Hello world</h1>
    </div>
  );
}
