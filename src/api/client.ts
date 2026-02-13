import http from "../utils/http";
import { Res } from "../dto/format";
import { LoginRequest, LoginResponse, RegisterRequest} from "../dto/auth/user.DTO";

export const apiRequest = {
    login(userAccount: LoginRequest){
        return http.post<Res<LoginResponse>>('api/auth/login',userAccount);
    },
    Register(newAccount: RegisterRequest){
        return http.post<Res<RegisterRequest>>('/api/auth/register',newAccount)
    },

};
