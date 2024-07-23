// getAutomationById.ts
import getLogger from '../utils/logger';
const logger = getLogger('getAutomationDetails.ts');
import { pfUser } from "../stores/localDataStore";
import { get } from 'svelte/store';
import { appConfig } from '../app-config';
const { api_endpoint } = appConfig;

export async function getAutomationById(automationId: string) {
  // Get token from store
  const user = get(pfUser);
  const token = user ? user.idToken : null;
  const apiPath = `${api_endpoint}automations/${automationId}`;

  const response = await fetch(apiPath, {
    method: 'GET',
    headers: {
      'Authorization': token
    }
  });

  if (!response.ok) {
    throw new Error('Failed to load automation details');
  }

  const data = await response.json();
  logger.info('getAutomationById.ts', 'getAutomationById', 'Loaded automation details', {apiPath, data});
  return data;
}