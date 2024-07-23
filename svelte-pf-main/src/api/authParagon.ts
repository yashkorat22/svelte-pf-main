// authParagon.ts
import { paragon, type AuthenticatedConnectUser } from '@useparagon/connect';
import getLogger from '../utils/logger';
import { appConfig } from '../app-config';
import { pfUser, activeIntegrations } from '../stores/localDataStore'; // Import pfUser and activeIntegrations
import PARAGON_INTEGRATIONS from './paragonIntegrations';

const logger = getLogger('api/authParagon.ts');

interface UseParagonReturn {
  authenticateWithParagon: (paragonJwt: string) => Promise<void>;
  initParagon: () => Promise<void>;
  loadActiveIntegrations: () => void;
}

export function getParagonIntegrationLogo(integrationType: string) {
  return (
    PARAGON_INTEGRATIONS[integrationType as keyof typeof PARAGON_INTEGRATIONS]
      ?.logo || ''
  );
}

function getActiveIntegrations(integrations: ParagonIntegrations) {
  const activeIntegrations = Object.fromEntries(
    Object.entries(integrations).filter(
      ([, integration]) => integration?.enabled
    )
  );

  if (Object.keys(activeIntegrations).length > 0) {
    return paragonIntegrationsNormalizer(activeIntegrations);
  }

  return {};
}

function paragonIntegrationsNormalizer(integrations: ParagonIntegrations) {
  return Object.entries(integrations).reduce((acc, [key, value]) => {
    // @ts-ignore - TS is complaining about the keys types
    const integration = PARAGON_INTEGRATIONS[key];
    // @ts-ignore - TS is complaining about the keys types
    acc[key] = {
      ...value,
      logo: integration?.logo || '',
      label: integration?.label || '',
    };
    return acc;
  }, {});
}

async function authenticateWithParagon(paragonToken: string) {
  logger.info('authParagon.ts', 'authenticateWithParagon', 'Starting Paragon authentication', { paragonToken });

  try {
    const paragonProjectId = appConfig.pf_paragon_id;
    if (!paragonProjectId) {
      logger.error('authParagon.ts', 'authenticateWithParagon', 'pf_paragon_id is not set');
      throw new Error('pf_paragon_id is not set');
    }

    await paragon.authenticate(paragonProjectId, paragonToken);
    logger.info('authParagon.ts', 'authenticateWithParagon', 'Paragon authentication successful');
  } catch (error) {
    logger.error('authParagon.ts', 'authenticateWithParagon', 'Error during Paragon authentication', error);
    throw error;
  }
}

async function initParagon() {
  logger.info('authParagon.ts', 'initParagon', 'Initializing Paragon');

  try {
    const paragonUser = paragon.getUser() as AuthenticatedConnectUser;
    
    // Fetch the user info from the local store
    let jwtUser;
    const unsubscribe = pfUser.subscribe((value) => {
      jwtUser = value;
    });

    if (!jwtUser) {
      logger.error('authParagon.ts', 'initParagon', 'Failed to obtain JWT user from pfUser store');
      unsubscribe();
      throw new Error('Failed to obtain JWT user from pfUser store');
    }

    unsubscribe();

    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.has('debug')) {
      logger.info('authParagon.ts', 'initParagon', 'PARAGON USER', paragonUser);
      logger.info('authParagon.ts', 'initParagon', 'JWT USER', jwtUser);
    }

    if (paragonUser?.integrations) {
      const integrations = getActiveIntegrations(paragonUser.integrations);
      logger.info('authParagon.ts', 'initParagon', 'Active integrations found', { integrations });
      
      activeIntegrations.set(integrations);
    }

    if ((!paragonUser?.meta || Object.keys(paragonUser.meta).length === 0) ||
      (paragonUser?.meta?.Name && paragonUser.meta.Name.includes(paragonUser.userId))) {
      const domain = appConfig.oauth.domain;
      const domainName = domain.split('.')[0];
      const newName = `${jwtUser.email} - ${domainName}`;  // Using email instead of name if that's better for privacy
      let newMetadata = {
        Name: newName,
        Email: jwtUser.email,
        pf_cust: jwtUser.pf_cust
      };
      logger.info('authParagon.ts', 'initParagon', 'Updating Paragon user with new metadata', { newMetadata });
      paragon.setUserMetadata(newMetadata);
    }
  } catch (error) {
    logger.error('authParagon.ts', 'initParagon', 'Error during initParagon', error);
  }
}

export { authenticateWithParagon, initParagon };