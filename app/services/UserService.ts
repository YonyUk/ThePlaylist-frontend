import { ROUTES } from "~/routes";
import { AxiosClient, type PaginatedResponse, type PaginationParams } from "./http/AxiosClient";
import environmentSettings from "~/environment";
import type { UserDto } from "~/dtos/userdtos";

export class UserService {

    private axiosClient: AxiosClient;
    private basePath: string = '';

    constructor(
        axiosClient: AxiosClient
    ) {
        this.axiosClient = axiosClient;
        if (environmentSettings.usersUrl)
            this.basePath = environmentSettings.usersUrl;
    }

    private normalizePaginationParams(params?: PaginationParams) {
        return {
            page: params?.page || 1,
            limit: params?.limit || 10,
        };
    }

    private transformApiUserToDomain(apiUser: any): UserDto {
        return {
            id: apiUser.id,
            username: apiUser.username,
            email: apiUser.email
        };
    }

    private handleUserError(error: Error): void {
        console.error('[UserService Error]', error.message);
        // Lógica específica para errores de usuario
    }

    public async getAll(params?: PaginationParams): Promise<PaginatedResponse<UserDto>> {
        try {
            const response = await this.axiosClient.get<PaginatedResponse<UserDto>>(
                this.basePath,
                {
                    params: this.normalizePaginationParams(params),
                }
            );
            return {
                ...response,
                data: response.data.map(this.transformApiUserToDomain),
            };
        } catch (error: any) {
            this.handleUserError(error);
            throw error
        }
    }
}