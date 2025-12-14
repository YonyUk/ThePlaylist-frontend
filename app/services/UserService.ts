import { ROUTES } from "~/routes";
import { AxiosClient, type PaginatedResponse, type PaginationParams } from "./http/AxiosClient";
import environmentSettings from "~/environment";
import type { UserDto,CreateUserDto } from "~/dtos/userdtos";
import { type NetworkError, type ValidationError } from "~/types/responsetypes";

export class UserService {

    private axiosClient:AxiosClient;
    private static instance:UserService;

    private constructor( ) {
        this.axiosClient = new AxiosClient(String(environmentSettings.apiUrl));
    }

    public static get():UserService {
        if (!this.instance)
            this.instance = new UserService();
        return this.instance;
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

    public async create(user:CreateUserDto) {
        return await this.axiosClient.post<NetworkError | ValidationError | UserDto>(`${environmentSettings.usersUrl}/register`,user);
    }

    public async getAll(params?: PaginationParams): Promise<PaginatedResponse<UserDto>> {
        try {
            const response = await this.axiosClient.get<PaginatedResponse<UserDto>>(
                String(environmentSettings.usersUrl),
                {
                    params: this.normalizePaginationParams(params),
                }
            );
            return {
                ...response.data,
                data: response.data.data.map(this.transformApiUserToDomain),
            };
        } catch (error: any) {
            this.handleUserError(error);
            throw error
        }
    }
}