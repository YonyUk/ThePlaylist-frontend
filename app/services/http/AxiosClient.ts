import axios, {
    type AxiosInstance,
    type AxiosRequestConfig,
    type AxiosResponse,
    type InternalAxiosRequestConfig
} from 'axios';
import Cookies from 'js-cookie';
import environmentSettings from '~/environment';
import { ROUTES } from '~/routes';

export class AxiosClient {
    private instance: AxiosInstance;

    constructor(baseUrl: string) {
        this.instance = axios.create({
            baseURL: baseUrl,
            timeout: 10000,
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
        });
        this.setupInterceptors();
    }

    private setupInterceptors(): void {

        this.instance.interceptors.request.use(
            (config: InternalAxiosRequestConfig) => {

                const token = this.getAuthToken();
                if (token) {
                    config.headers.Authorization = `Bearer ${token}`;
                }

                return config;
            },
            (error) => {
                return Promise.reject(error);
            }
        );

        this.instance.interceptors.response.use(
            (response: AxiosResponse) => {
                return response;
            },
            (error) => {
                return this.handleError(error);
            }
        )
    }

    private async handleError(error: any): Promise<void> {
        if (axios.isCancel(error)) {
            throw new Error('RequestCancelledError');
        }

        if (!error.response) {
            error.response = {
                data:{
                    msg:'Network Error'
                }
            };
        }

        const { status, data } = error.response;

        switch (status) {
            case 401:
                await this.handleUnauthorized();
                // throw new Error('UnauthorizedError');
                break;

            case 403:
                // throw new Error('ForbiddenError');
                break;

            case 404:
                // throw new Error('NotFoundError');
                break;

            case 429:
                // Rate limiting - JUSTIFICACIÓN: Backoff automático
                await this.delay(1000);
                // throw new Error('RateLimitError');
                break;

            case 500:
                // throw new Error('ServerError');
                break;

            default:
                // throw new Error(`APIError: ${status}`);
                break;
        }
        return error.response;
    }

    public async get<T>(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
        return await this.instance.get<T>(url, config);
    }

    public async post<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
        return await this.instance.post<T>(url, data, config);
    }

    public async put<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
        return await this.instance.put<T>(url, data, config);
    }

    public async patch<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
        return await this.instance.patch<T>(url, data, config);
    }

    public async delete<T>(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
        return await this.instance.delete<T>(url, config)
    }

    public createCancelToken() {
        return axios.CancelToken.source();
    }

    private async delay(ms: number): Promise<void> {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    private async handleUnauthorized(): Promise<void> {

        try {
            const response = await this.instance.post(`${environmentSettings.apiUrl}/${environmentSettings.tokenUrl}`);
            Cookies.set('access_token', response.data.access_token);
            return;
        } catch (error) {
            this.redirectToLogin();
        }
    }

    private redirectToLogin(): void {
        window.location.href = ROUTES.REGISTER;
    }

    private getAuthToken(): string | null {
        const token = Cookies.get('access_token');
        return token ? token : null;
    }
};