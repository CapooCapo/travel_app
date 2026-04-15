import { authApi } from "./auth.api";
import { locationApi } from "./location.api";
import { userApi } from "./user.api";
import { eventApi } from "./event.api";
import { socialApi } from "./social.api";
import { travelApi } from "./travel.api";
import { chatApi } from "./chat.api";
import { adminApi } from "./admin.api";
import { skillApi } from "./skill.api";

export const apiRequest = {
  ...authApi,
  ...locationApi,
  ...userApi,
  ...eventApi,
  ...socialApi,
  ...travelApi,
  ...chatApi,
  ...adminApi,
  ...skillApi,
};
