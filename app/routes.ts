import { type RouteConfig, index, route } from "@react-router/dev/routes";

export const ROUTES = {
    HOME: '/',
    PLAYLISTS: '/playlists',
    TRACKS:'/playlists',
    REGISTER:'/register'
} as const;

export type AppRoute = keyof typeof ROUTES;
export type RoutePath = (typeof ROUTES)[AppRoute];

export default [
    index("routes/home.tsx"),
    route(ROUTES.PLAYLISTS,'routes/playlists/playlists.tsx'),
    route(`${ROUTES.PLAYLISTS}/:playlistId`,'routes/playlistview/playlistview.tsx')
] satisfies RouteConfig;
