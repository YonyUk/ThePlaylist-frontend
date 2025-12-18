export interface UserDto {
    id:string
    username:string
    email:string
}

export interface CreateUserDto {
    username:string
    password:string
    email:string
}

export interface UpdateUserDto {
    username:string
    password:string | null
    email:string
}