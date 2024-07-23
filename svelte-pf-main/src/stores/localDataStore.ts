// localDataStore.ts
import { persisted } from "svelte-local-storage-store";
import type { Skill } from '../types';

// Define the User type
type User = {
  username: string;
  idToken: string;
  paragonToken: string;
  email: string;
};
// Define the integration types
type ParagonIntegration = {
  logo: string;
  label: string;
  enabled: boolean;
};
type ParagonActiveIntegrations = {
  [key: string]: ParagonIntegration;
};

// Local storage-backed stores
export const lastAttemptedPath = persisted('lastAttemptedPath', '');
export const pfUser = persisted<User | null>('pfUser', null);
export const isAuthenticated = persisted('isAuthenticated', false);
export const activeIntegrations = persisted<ParagonActiveIntegrations>('activeIntegrations', {});
export const agentSkills = persisted<{ [key: string]: Skill[] }>('agentSkills', {});