/*-- loadAutomationLibrary.ts --*/
import getLogger from '../utils/logger';
const logger = getLogger('loadAutomationLibrary.ts');
import { pfUser } from "../stores/localDataStore";
import { get } from 'svelte/store';
import { appConfig } from '../app-config'; 
const { api_endpoint } = appConfig;

export async function libraryLoadAutomations() {
    //get token from store
    const user = get(pfUser);
    const token = user ? user.idToken : null;

    const response = await fetch(`${api_endpoint}/automations`, {
      method: 'GET',
      headers: {
        'Authorization': token
      }
    });
  
    if (!response.ok) {
      throw new Error('Failed to load automations');
    }
  
    const data = await response.json();
    logger.info('loadAutomationLibrary.ts', 'libraryLoadAutomations', 'Loaded automations', data);
    return data;
  }