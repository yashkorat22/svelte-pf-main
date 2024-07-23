//promptProcessing.ts
import type { Skill } from './types';
import getLogger from "./utils/logger";

const logger = getLogger("promptProcessing");

// Function to check if a word matches any skill tags
export function findMatchingSkills(skills: Skill[], word: string): Skill[] {
    logger.info(`Trying to match word: "${word}" with each skill's tags.`);
    return skills.filter((skill) => {
        if (Array.isArray(skill.tags)) {
            const doesMatch = skill.tags.some((tag) => tag.toLowerCase().includes(word.toLowerCase()));
            if (doesMatch) {
                logger.info(`The word "${word}" matches with tags in skill:`, skill);
            }
            return doesMatch;
        } else {
            logger.warn(`Skill ${skill.name} does not have a valid tags array.`);
        }
        return false;
    });
}

// Function to add a skill ID to the skills array if not already present
export function addSkillIdToArray(skillIds: string[], skillId: string): string[] {
    if (!skillIds.includes(skillId)) {
        return [...skillIds, skillId];
    }
    return skillIds;
}

// Function to remove a skill ID from the skills array
export function removeSkillIdFromArray(skillIds: string[], skillId: string): string[] {
    return skillIds.filter((id) => id !== skillId);
}

// Function to check if existing skills match any words in the prompt
export function getExistingSkillBadges(skills: Skill[], skillIds: string[], prompt: string): Skill[] {
    const words = prompt.split(/\s+/).map(word => word.toLowerCase());
    const matchedSkills: Skill[] = [];

    skillIds.forEach((id) => {
        const skill = skills.find((s) => s.id === id);
        if (skill && Array.isArray(skill.tags)) {
            const matches = skill.tags.some((tag) => words.includes(tag.toLowerCase()));
            if (matches) {
                matchedSkills.push(skill);
                logger.info(`Prompt word found in tags for skill:`, skill);
            }
        }
    });

    logger.info(`Existing badges found for prompt "${prompt}":`, matchedSkills);
    return matchedSkills;
}

/*
on change: 
* check if a partial word (3chars or more) matches any of the skills tags 
* if so, allow the user to select one of the matching tags
* when selected, add the id of the skill to the skillIds array for that step
* when selected, add a badge beneath the prompt textarea to indicate that the tag was selected
* put an X next to the badge so that it can be deleted
* on delete, remove the badge and the correspondng skillId from array

on load: 
* check if any of the existing steps have skillIds
* if so, lookup that skill by ID and see if any of the tags match any of the words in the prompt
* if so, add a badge to the UI with that tag name
*/