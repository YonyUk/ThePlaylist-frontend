export interface ValidationError {
    status:number;
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