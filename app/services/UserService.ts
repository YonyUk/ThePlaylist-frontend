import { AxiosClient } from "./http/AxiosClient";
import environmentSettings from "~/environment";
import type { UserDto,CreateUserDto } from "~/dtos/userdtos";
import { type AuthenticationError, type NetworkError, type ValidationError } from "~/types/responsetypes";

export interface TokenSchema{
    message:string;
    token_type:string;
}

export class UserService {

    private axiosClient:AxiosClient;
    private static instance:UserService;
    private environmentSettings = environmentSettings();

    private constructor( ) {
        this.axiosClient = new AxiosClient(String(this.environmentSettings.apiUrl));
    }

    public static get():UserService {
        if (!this.instance)
            this.instance = new UserService();
        return this.instance;
    }

    public async create(user:CreateUserDto) {
        return await this.axiosClient.post<NetworkError | ValidationError | UserDto>(
            this.environmentSettings.registerUrl,
            user,
            {withCredentials:false}
        );
    }

    public async authenticate(username:string,password:string) {
        const response = await this.axiosClient.post<NetworkError | AuthenticationError | TokenSchema>(
            `${this.environmentSettings.usersUrl}/token`,
            {
                username,
                password
            },
            {
                headers:{
                    "Content-Type":'application/x-www-form-urlencoded'
                }
            }
        );
        return response;
    }

    public async logout(){
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

}