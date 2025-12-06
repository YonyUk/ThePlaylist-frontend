import { type RouteConfig, index, route } from "@react-router/dev/routes";

export const ROUTES = {
    HOME: '/',
    PLAYLISTS: '/playlists',
    LOGIN:'/login'
} as const;

export type AppRoute = keyof typeof ROUTES;
export type RoutePath = (typeof ROUTES)[AppRoute];

export default [
    index("routes/home.tsx"),
    route('playlists','routes/playlists/playlists.tsx')
] satisfies RouteConfig;
