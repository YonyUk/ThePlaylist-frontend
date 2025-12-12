import BaseService from "../baseservice";

class AuthService extends BaseService{

    constructor(endpoint:string){
        super(endpoint);
    }

    userIsAuthenticated() : boolean {
        return false;
    }
}

export default AuthService