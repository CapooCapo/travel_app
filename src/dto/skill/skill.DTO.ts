export interface SkillDTO {
  name: string;
  description: string;
  bundle: string;
  tags: string[];
  content?: string;
  path?: string;
}

export const mapSkill = (data: any): SkillDTO => ({
  name: data.name || "",
  description: data.description || "",
  bundle: data.bundle || "",
  tags: data.tags || [],
  content: data.content,
  path: data.path,
});
