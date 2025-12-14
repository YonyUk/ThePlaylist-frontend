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

    private handleUserError(error: Error): void {
        console.error('[UserService Error]', error.message);
        // Lógica específica para errores de usuario
    }

    public async create(user:CreateUserDto) {
        return await this.axiosClient.post<NetworkError | ValidationError | UserDto>(`${environmentSettings.usersUrl}/register`,user);
    }
}