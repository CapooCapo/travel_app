import http from "../utils/http";
import { Res } from "../dto/format";
import { SkillDTO } from "../dto/skill/skill.DTO";

export const skillApi = {
  getSkills() {
    return http.get<Res<SkillDTO[]>>("/api/skills")
      .then(res => res.data);
  },
  getSkillByName(name: string) {
    return http.get<Res<SkillDTO>>(`/api/skills/${name}`)
      .then(res => res.data);
  },
  syncSkills(skills: SkillDTO[]) {
    return http.post<Res<null>>("/api/skills/sync", skills)
      .then(res => res.data);
  },
};
