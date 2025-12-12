import type { AxiosInstance } from "axios";
import apiClient from "./api/apiservice";

class BaseService {

    private endpoint: string
    private api: AxiosInstance

    constructor(endpoint: string) {

        this.endpoint = endpoint;
        this.api = apiClient;

    }

    async create(data: any) {
        try {
            const response = await this.api.post(this.endpoint,data);
            return this.handleResponse(response);
        } catch (error) {
            return this.handleError(error);
        }
    }

    handleResponse(response: any) {
        return {
            success: true,
            data: response.data,
            status: response.status,
            headers: response.headers
        };
    }

    handleError(error: any) {
        const errorData = {
            success: false,
            message: error.response?.data?.message || error.message,
            status: error.response?.status,
            data: error.response?.data
        }

        console.error(`Error at ${this.endpoint}:`, errorData);
        return errorData;
    }
}

export default BaseService;