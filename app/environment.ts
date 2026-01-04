const environmentSettings = () => {
    try {
        const apiUrl = process.env.REACT_APP_API_URL;
        const tokenUrl = process.env.REACT_APP_API_ACCESS_TOKEN_URL;
        const registerUrl = process.env.REACT_APP_API_REGISTER_URL;
        const usersUrl = process.env.REACT_APP_API_USERS_URL;
        const usersMeUrl = process.env.REACT_APP_USERS_ME_URL;
        const usersVerifyUrl = process.env.REACT_APP_USERS_VERIFY_URL;
        const usersLogoutUrl = process.env.REACT_APP_USERS_LOGOUT_URL;
        const playlistsUrl = process.env.REACT_APP_PLAYLISTS_URL;
        const playlistsSearchUrl = process.env.REATC_APP_PLAYLISTS_SEARCH_URL;
        const tracksUrl = process.env.REACT_APP_TRACKS_URL;

        return {
            apiUrl,
            tokenUrl,
            registerUrl,
            usersUrl,
            usersMeUrl,
            usersVerifyUrl,
            usersLogoutUrl,
            playlistsUrl,
            playlistsSearchUrl,
            tracksUrl
        };
    } catch (error) {
        const apiUrl = import.meta.env.VITE_API_URL;
        const tokenUrl = import.meta.env.VITE_API_ACCESS_TOKEN_URL;
        const registerUrl = import.meta.env.VITE_API_REGISTER_URL;
        const usersUrl = import.meta.env.VITE_API_USERS_URL;
        const usersMeUrl = import.meta.env.VITE_API_USERS_ME_URL;
        const usersVerifyUrl = import.meta.env.VITE_API_USERS_VERIFY_URL;
        const usersLogoutUrl = import.meta.env.VITE_API_USESR_LOGOUT_URL;
        const playlistsUrl = import.meta.env.VITE_API_PLAYLISTS_URL;
        const playlistsSearchUrl = import.meta.env.VITE_API_PLAYLISTS_SEARCH_URL;
        const tracksUrl = import.meta.env.VITE_API_TRACKS_URL;

        return {
            apiUrl,
            tokenUrl,
            registerUrl,
            usersUrl,
            usersMeUrl,
            usersVerifyUrl,
            usersLogoutUrl,
            playlistsUrl,
            playlistsSearchUrl,
            tracksUrl
        };
    }
}

export default environmentSettings;