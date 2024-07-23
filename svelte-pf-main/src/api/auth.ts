// auth.ts
import getLogger from '../utils/logger';
import { appConfig } from '../app-config';  
import { isAuthenticated, pfUser } from "../stores/localDataStore";
import { navigate } from "svelte-routing";
import { authenticateWithParagon, initParagon } from './authParagon'; // Import functions from authParagon.ts

const logger = getLogger('api/auth.ts');

logger.info('auth.ts', 'appConfig', appConfig);

async function signIn(username: string, password: string) {
  logger.info('auth.ts', 'signIn', 'Starting sign-in process');

  const { aws_cognito_region, aws_user_pools_web_client_id, api_endpoint } = appConfig;

  try {
    logger.info('auth.ts', 'signIn', 'Sending request to Cognito', {
      cognitoEndpoint: `https://cognito-idp.${aws_cognito_region}.amazonaws.com/`,
      username,
    });

    const cognitoResponse = await fetch(`https://cognito-idp.${aws_cognito_region}.amazonaws.com/`, {
        method: 'POST',
        headers: {
            'X-Amz-Target': 'AWSCognitoIdentityProviderService.InitiateAuth',
            'Content-Type': 'application/x-amz-json-1.1',
        },
        body: JSON.stringify({
            AuthParameters: {
                USERNAME: username,
                PASSWORD: password,
            },
            AuthFlow: 'USER_PASSWORD_AUTH',
            ClientId: aws_user_pools_web_client_id,
        }),
    });

    logger.info('auth.ts', 'signIn', 'Received response from Cognito');

    const cognitoData = await cognitoResponse.json();
    if (!cognitoData.AuthenticationResult) {
        logger.error('auth.ts', 'signIn', 'Authentication failed', cognitoData);
        throw new Error('Authentication failed');
    }

    const idToken = cognitoData.AuthenticationResult.IdToken;
    const decodedToken = JSON.parse(atob(idToken.split('.')[1]));
    const email = decodedToken.email;

    logger.info('auth.ts', 'signIn', 'Cognito ID Token acquired', { idToken, email });

    const paragonToken = await fetchParagonToken(idToken, api_endpoint);

    isAuthenticated.set(true);

    pfUser.set({ username, idToken, paragonToken, email });

    await authenticateWithParagon(paragonToken); // Authenticate with Paragon
    await initParagon(); // Initialize Paragon

    return { idToken, paragonToken };

  } catch (error) {
    isAuthenticated.set(false);
    pfUser.set(null);
    throw error;
  }
}

async function fetchParagonToken(cognitoIdToken: string, apiDomain: string) {
  logger.info('auth.ts', 'fetchParagonToken', 'Fetching Paragon token', { cognitoIdToken });

  try {
    const response = await fetch(`${apiDomain}/ext/paragon/jwt`, {
        method: 'GET',
        headers: {
            'Authorization': cognitoIdToken,
        },
    });

    logger.info('auth.ts', 'fetchParagonToken', 'Received response from Paragon endpoint');

    if (!response.ok) {
        const errorText = await response.text();
        logger.error('auth.ts', 'fetchParagonToken', 'Error fetching Paragon token', { statusCode: response.status, errorText });
        throw new Error('Error fetching Paragon token');
    }

    const paragonToken = await response.json();
    return paragonToken;
  } catch (error) {
    logger.error('auth.ts', 'fetchParagonToken', 'Error during fetchParagonToken', error);
    throw error;
  }
}

// New signout function
function signout() {
  logger.info('auth.ts', 'signout', 'Signing out');
  // Clear user data
  pfUser.set(null);
  // Update authentication state
  isAuthenticated.set(false);
  // Redirect to the signout route
  navigate('/signout');
}

export { signIn, signout };