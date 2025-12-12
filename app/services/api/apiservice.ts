import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import Cookies from 'js-cookie';
import { ROUTES } from '~/routes';
import environmentSettings from '~/environment';

const apiClient = axios.create({
    baseURL: environmentSettings.apiUrl,
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
    },
});

apiClient.interceptors.request.use(
    (config) => {

        const token = Cookies.get('access_token');

        if (token) {
            try {
                const decoded = jwtDecode(token);
                const currentTime = Date.now() / 1000;

                if (decoded.exp && decoded.exp - currentTime < 300) {
                    console.warn('token is about to expire, refreshing ... ');
                    // ... call refreshing function
                }
            } catch (error) {
                console.error('error decoding token');
            }

            config.headers.Authorization = `Bearer ${token}`;
        }

        return config;
    },
    (error) => Promise.reject(error)
);

apiClient.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            try {
                const refreshToken = Cookies.get('refresh_token');
                const response = await axios.post(`${environmentSettings.apiUrl}/${environmentSettings.tokenUrl}`, { refreshToken });

                const { accessToken } = response.data;
                Cookies.set('access_token', accessToken, { path: '/' });

                originalRequest.headers.Authorization = `Bearer ${accessToken}`;
                return apiClient(originalRequest);
            } catch (refreshError) {
                Cookies.remove('access_token');
                Cookies.remove('refresh_token');
                window.location.href = ROUTES.LOGIN;
                return Promise.reject(refreshError);
            }
        }

        const errorMessage = error.response?.data?.message || error.message;
        console.error('api error:',errorMessage);

        return Promise.reject(error);
    }
);

export default apiClient;