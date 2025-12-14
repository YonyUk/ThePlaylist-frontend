export interface ValidationError {
    detail:ValidationErrorDetail[];
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