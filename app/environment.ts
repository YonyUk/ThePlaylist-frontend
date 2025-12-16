const apiUrl = import.meta.env.VITE_API_URL;
const tokenUrl = import.meta.env.VITE_API_ACCESS_TOKEN_URL;
const registerUrl = import.meta.env.VITE_API_REGISTER_URL
const usersUrl = import.meta.env.VITE_API_USERS_URL

const environmentSettings = {
    apiUrl,
    tokenUrl,
    registerUrl,
    usersUrl
}

export default environmentSettings;