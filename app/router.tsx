import { createBrowserRouter } from "react-router";
import Register from "./routes/register/register";
import Home from "./routes/home";
import PlayLists from "./routes/playlists/playlists";
import PlayListView from "./routes/playlistview/playlistview";
import { ROUTES } from "./routes";

export const router = createBrowserRouter([
    {
        path:ROUTES.HOME,
        element: <Home/>
    },
    {
        path:ROUTES.REGISTER,
        element:<Register/>
    },
    {
        path:ROUTES.PLAYLISTS,
        element:<PlayLists/>
    }
])