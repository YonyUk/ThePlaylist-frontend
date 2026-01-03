import { type RouteConfig, index, layout, route } from "@react-router/dev/routes";


export const ROUTES = {
    HOME: '/',
    PLAYLISTS: '/playlists',
    TRACKS:'/playlists',
    REGISTER:'/register',
    LOGIN:'/login',
    SETTINGS:'/settings',
    MYPLAYLISTS:'/myplaylists'
} as const;

export type AppRoute = keyof typeof ROUTES;
export type RoutePath = (typeof ROUTES)[AppRoute];

export default [
    index("routes/home.tsx"),
    route(ROUTES.PLAYLISTS,'routes/playlists/playlists.tsx'),
    route(`${ROUTES.PLAYLISTS}/:playlistId`,'routes/playlistview/playlistview.tsx'),
    route(ROUTES.REGISTER,'routes/register/register.tsx'),
    route(ROUTES.LOGIN,'routes/login/login.tsx'),
    layout('routes/account/account.tsx',[
        route(ROUTES.SETTINGS,'routes/account/settings/settings.tsx'),
        route(`${ROUTES.MYPLAYLISTS}/:page`,'routes/account/playlists/myplaylists.tsx')
    ])
] satisfies RouteConfig;
