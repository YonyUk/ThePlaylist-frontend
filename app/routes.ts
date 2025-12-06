import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
    index("routes/home.tsx"),
    route('playlists','routes/playlists/playlists.tsx')
] satisfies RouteConfig;
