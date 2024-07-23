// getAutomationResultsByStep.ts
import getLogger from '../utils/logger';
import { pfUser } from "../stores/localDataStore";
import { get } from 'svelte/store';
import { appConfig } from '../app-config';

const logger = getLogger('getAutomationResultsByStep.ts');
const { api_endpoint } = appConfig;

export async function getAutomationResultsByStep(automationId: string, stepIndex: number, automationVersion: string) {
  // Get token from store
  const user = get(pfUser);
  const token = user ? user.idToken : null;
  const apiPath = `${api_endpoint}automations/${automationId}/steps/${stepIndex}/v/${automationVersion}/results`;

  const response = await fetch(apiPath, {
    method: 'GET',
    headers: {
      'Authorization': token
    }
  });

  if (!response.ok) {
    throw new Error('Failed to load automation results for step');
  }

  const data = await response.text(); // Assuming the API endpoint returns plain text results
  logger.info('getAutomationResultsByStep.ts', 'getAutomationResultsByStep', 'Loaded automation results for step', { apiPath, automationId, stepIndex, automationVersion, data });
  return data;
}