//getAgentSkills.ts
import getLogger from '../utils/logger';
const logger = getLogger('getAgentSkills.ts');
import { pfUser, agentSkills } from "../stores/localDataStore";
import { get } from 'svelte/store';
import { appConfig } from '../app-config';
const { api_endpoint } = appConfig;
import type { Skill } from '../types';

// Fetch agent skills and store them
export async function fetchAgentSkills(agentId: string) {
  // Get token and current skills from store
  const user = get(pfUser);
  const token = user ? user.idToken : null;
  const currentSkills = get(agentSkills);
  
  // Check if skills are already in the store
  if (currentSkills[agentId]) {
    logger.info('getAgentSkills.ts', 'fetchAgentSkills', `Skills for agent ${agentId} are already in the store`, {'agentId':agentId, 'currentSkills[agentId]':currentSkills[agentId]});
    return currentSkills[agentId];
  }
  
  const apiPath = `${api_endpoint}agents/${agentId}/skills`;

  try {
    const response = await fetch(apiPath, {
      method: 'GET',
      headers: {
        'Authorization': token
      }
    });

    if (!response.ok) {
      throw new Error(`Failed to load skills for agent ${agentId}`);
    }

    const data: Skill[] = await response.json();
    logger.info('getAgentSkills.ts', 'fetchAgentSkills', `Loaded skills for agent ${agentId}`, { apiPath, data });

    // Update the local storage store with the fetched skills
    agentSkills.update((currentSkills) => ({
      ...currentSkills,
      [agentId]: data
    }));

    return data;
  } catch (error) {
    logger.error('getAgentSkills.ts', 'fetchAgentSkills', `Failed to fetch skills for agent ${agentId}`, { apiPath, error });
    throw error;
  }
}

// Fetch skills for all default agents
export async function fetchAllDefaultAgentSkills() {
  const defaultAgents = appConfig.defaultAgents;

  for (const agent of defaultAgents) {
    await fetchAgentSkills(agent);
  }
}