import http from "../utils/http";
import { Res } from "../dto/format";

export const authApi = {
  syncUser(data?: any) {
    return http.post<Res<null>>("/api/users/sync", data);
  },
};
