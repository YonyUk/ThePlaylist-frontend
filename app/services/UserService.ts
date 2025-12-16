import { AxiosClient } from "./http/AxiosClient";
import environmentSettings from "~/environment";
import type { UserDto,CreateUserDto } from "~/dtos/userdtos";
import { type AuthenticationError, type NetworkError, type ValidationError } from "~/types/responsetypes";
import { jwtDecode } from "jwt-decode";
import Cookies from "universal-cookie";

export interface TokenSchema{
    access_token:string;
    token_type:string;
}

export class UserService {

    private axiosClient:AxiosClient;
    private static instance:UserService;
    private cookies:Cookies = new Cookies(null,{path:'/'});

    private constructor( ) {
        this.axiosClient = new AxiosClient(String(environmentSettings.apiUrl));
    }

    public static get():UserService {
        if (!this.instance)
            this.instance = new UserService();
        return this.instance;
    }

    public async create(user:CreateUserDto) {
        return await this.axiosClient.post<NetworkError | ValidationError | UserDto>(
            `${environmentSettings.usersUrl}/register`,
            user
        );
    }

    public async authenticate(username:string,password:string) {
        const response = await this.axiosClient.post<NetworkError | AuthenticationError | TokenSchema>(
            `${environmentSettings.usersUrl}/token`,
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

    public authenticated() {
        if (this.cookies.get('access_token'))
            return true;
        return false;
    }

}