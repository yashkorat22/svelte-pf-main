// getAutomationCodeByStep.ts
import getLogger from '../utils/logger';
import { pfUser } from "../stores/localDataStore";
import { get } from 'svelte/store';
import { appConfig } from '../app-config';

const logger = getLogger('getAutomationCodeByStep.ts');
const { api_endpoint } = appConfig;

export async function getAutomationCodeByStep(automationId: string, stepIndex: number, automationVersion: string) {
  // Get token from store
  const user = get(pfUser);
  const token = user ? user.idToken : null;
  const apiPath = `${api_endpoint}automations/${automationId}/steps/${stepIndex}/v/${automationVersion}/code`;

  const response = await fetch(apiPath, {
    method: 'GET',
    headers: {
      'Authorization': token
    }
  });

  if (!response.ok) {
    throw new Error('Failed to load automation code for step');
  }

  const data = await response.text(); // Assuming the API endpoint returns plain text code
  logger.info('getAutomationCodeByStep.ts', 'getAutomationCodeByStep', 'Loaded automation code for step', { apiPath, automationId, stepIndex, automationVersion, data });
  return data;
}