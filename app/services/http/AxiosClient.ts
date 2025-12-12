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

    private async handleError(error: any): Promise<never> {
        if (axios.isCancel(error)) {
            throw new Error('RequestCancelledError');
        }

        if (!error.response) {
            throw new Error('Network error');
        }

        const { status, data } = error.response;

        switch (status) {
            case 401:
                await this.handleUnauthorized();
                throw new Error('UnauthorizedError');

            case 403:
                throw new Error('ForbiddenError');

            case 404:
                throw new Error('NotFoundError');

            case 429:
                // Rate limiting - JUSTIFICACIÓN: Backoff automático
                await this.delay(1000);
                throw new Error('RateLimitError');

            case 500:
                throw new Error('ServerError');

            default:
                throw new Error(`APIError: ${status}`);
        }
    }

    public async get<T>(url:string,config?:AxiosRequestConfig): Promise<T> {
        const response = await this.instance.get<T>(url,config);
        return response.data;
    }

    public async post<T>(url:string,data?:any,config?:AxiosRequestConfig): Promise<T> {
        const response = await this.instance.post<T>(url,data,config);
        return response.data;
    }

    public async put<T>(url:string,data?: any,config?: AxiosRequestConfig): Promise<T> {
        const response = await this.instance.put<T>(url,data,config);
        return response.data;
    }

    public async patch<T>(url:string,data?: any, config?: AxiosRequestConfig): Promise<T> {
        const response = await this.instance.patch<T>(url,data,config);
        return response.data;
    }

    public async delete<T>(url:string,config?: AxiosRequestConfig): Promise<T> {
        const response = await this.instance.delete<T>(url,config)
        return response.data;
    }

    public createCancelToken() {
        return axios.CancelToken.source();
    }

    private async delay(ms: number): Promise<void> {
        return new Promise(resolve => setTimeout(resolve,ms));
    }

    private async handleUnauthorized(): Promise<void>{
        
        try {
            const response = await this.instance.post(`${environmentSettings.apiUrl}/${environmentSettings.tokenUrl}`);
            Cookies.set('access_token',response.data.access_token);
            return;
        } catch (error) {
            this.redirectToLogin();
        }
    }

    private redirectToLogin(): void{
        window.location.href = ROUTES.LOGIN;
    }

    private getAuthToken(): string | null {
        const token = Cookies.get('access_token');
        return token ? token : null;
    }
}