import { apiRequest } from "../api/client";
import { unwrapResponse } from "../utils/responseHandler";
import { SkillDTO, mapSkill } from "../dto/skill/skill.DTO";

export const skillService = {
  /**
   * Fetches the metadata for all available skills.
   * Optimized for "Packet Handling" by omitting the full Markdown content.
   */
  async getSkillsMetadata(): Promise<SkillDTO[]> {
    try {
      const data = unwrapResponse(await apiRequest.getSkills());
      return (data || []).map(mapSkill);
    } catch (error) {
      console.error("[SkillService] getSkillsMetadata error:", error);
      return [];
    }
  },

  /**
   * Fetches full skill details including Markdown content.
   */
  async getSkillDetail(name: string): Promise<SkillDTO | null> {
    try {
      const data = unwrapResponse(await apiRequest.getSkillByName(name));
      if (!data) return null;
      return mapSkill(data);
    } catch (error) {
      console.error("[SkillService] getSkillDetail error:", error);
      return null;
    }
  },

  /**
   * Bulk synchronization of skills.
   * Addresses "TPS" optimization for large-scale ingestion.
   */
  async syncSkills(skills: SkillDTO[]): Promise<void> {
    try {
      await apiRequest.syncSkills(skills);
    } catch (error) {
      console.error("[SkillService] syncSkills error:", error);
      throw error;
    }
  }
};
