import { AxiosClient } from "./http/AxiosClient";
import environmentSettings from "~/environment";
import type { UserDto, CreateUserDto, UpdateUserDto } from "~/dtos/userdtos";
import { type AuthenticationError, type NetworkError, type ValidationError } from "~/types/responsetypes";
import type { PlaylistDTO } from "~/dtos/playlistdto";

export interface TokenSchema {
    message: string;
    token_type: string;
}

export class UserService {

    private axiosClient: AxiosClient;
    private static instance: UserService;
    private environmentSettings = environmentSettings();

    private constructor() {
        this.axiosClient = new AxiosClient(String(this.environmentSettings.apiUrl));
    }

    public static get(): UserService {
        if (!this.instance)
            this.instance = new UserService();
        return this.instance;
    }

    public async create(user: CreateUserDto) {
        return await this.axiosClient.post<NetworkError | ValidationError | UserDto>(
            this.environmentSettings.registerUrl,
            user,
            { withCredentials: false }
        );
    }

    public async authenticate(username: string, password: string) {
        const response = await this.axiosClient.post<NetworkError | AuthenticationError | TokenSchema>(
            `${this.environmentSettings.usersUrl}/token`,
            {
                username,
                password
            },
            {
                headers: {
                    "Content-Type": 'application/x-www-form-urlencoded'
                }
            }
        );
        return response;
    }

    public async logout() {
        const response = await this.axiosClient.post(this.environmentSettings.usersLogoutUrl)
        return response.status === 200;
    }

    public async authenticated() {
        try {
            const response = await this.axiosClient.get<UserDto>(this.environmentSettings.usersMeUrl);
            return response.status === 200;
        } catch (error) {
            return false;
        }
    }

    public async getInfo() {
        return await this.axiosClient.get<UserDto>(this.environmentSettings.usersMeUrl);
    }

    public async updateInfo(user_id: string, data: UpdateUserDto) {
        return await this.axiosClient.put<UserDto | ValidationError>(`${this.environmentSettings.usersUrl}/${user_id}`, data);
    }

    public async userPlaylists(user_id: string, page: number = 0, limit: number = 10) {
        const url = `${this.environmentSettings.playlistsSearchUrl}/users/${user_id}`;
        return await this.axiosClient.get<PlaylistDTO[]>(url, {
            params: { page, limit }
        });
    }

    public async myPlaylists(page: number = 0, limit: number = 10) {
        const url = `${this.environmentSettings.playlistsUrl}/me`;
        return await this.axiosClient.get<PlaylistDTO[]>(url,{
            params:{page,limit}
        });
    }
}