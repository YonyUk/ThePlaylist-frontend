export interface ValidationError {
    detail:ValidationErrorDetail[];
}

export interface AuthenticationError {
    detail:string
}

export interface ValidationErrorDetail{
    msg:string;
    type:string;
    loc:any[];
    input:string;
}

export interface NetworkError{
    msg:string;
}

export interface ExistencialQuery{
    result:boolean
}