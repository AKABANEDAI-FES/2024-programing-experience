import aspida from '@aspida/axios';
import {
  AdminCreateUserCommand,
  AdminInitiateAuthCommand,
} from '@aws-sdk/client-cognito-identity-provider';
import api from 'api/$api';
import axios from 'axios';
import { WS_PATH } from 'common/constants';
import { COOKIE_NAME } from 'service/constants';
import {
  API_BASE_PATH,
  COGNITO_USER_POOL_CLIENT_ID,
  COGNITO_USER_POOL_ID,
} from 'service/envValues';
import { cognitoClient } from 'tests/api/cognito';
import { ulid } from 'ulid';
import WebSocket from 'ws';
import { TEST_PORT } from './utils';

const baseURL = `http://127.0.0.1:${TEST_PORT}${API_BASE_PATH}`;

export const noCookieClient = api(
  aspida(undefined, { baseURL, headers: { 'Content-Type': 'text/plain' } }),
);

export const createSessionClients = async (): Promise<{
  apiClient: typeof noCookieClient;
  wsClient: WebSocket;
}> => {
  const userName = `test-${ulid()}`;
  const password = `Test-user-${ulid()}`;
  const command1 = new AdminCreateUserCommand({
    UserPoolId: COGNITO_USER_POOL_ID,
    Username: userName,
    TemporaryPassword: password,
    UserAttributes: [{ Name: 'email', Value: `${ulid()}@example.com` }],
  });

  await cognitoClient.send(command1);

  const command2 = new AdminInitiateAuthCommand({
    AuthFlow: 'ADMIN_NO_SRP_AUTH',
    UserPoolId: COGNITO_USER_POOL_ID,
    ClientId: COGNITO_USER_POOL_CLIENT_ID,
    AuthParameters: { USERNAME: userName, PASSWORD: password },
  });

  const cookie = await cognitoClient
    .send(command2)
    .then((res) => `${COOKIE_NAME}=${res.AuthenticationResult?.IdToken}`);

  const agent = axios.create({ baseURL, headers: { cookie, 'Content-Type': 'text/plain' } });

  agent.interceptors.response.use(undefined, (err) =>
    Promise.reject(axios.isAxiosError(err) ? new Error(JSON.stringify(err.toJSON())) : err),
  );

  return api(aspida(agent));
};

export const createGoogleUserClient = async (): Promise<typeof noCookieClient> => {
  const codeVerifier = ulid();
  const user = await fetch(`${COGNITO_POOL_ENDPOINT}/public/socialUsers`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      provider: 'Google',
      name: 'user1',
      email: `${ulid()}@example.com`,
      isAdmin: false,
      language: 'KANJI',
      photoUrl: 'https://example.com/user.png',
      codeChallenge: createHash('sha256').update(codeVerifier).digest('base64url'),
      userPoolClientId: COGNITO_USER_POOL_CLIENT_ID,
    }),
  }).then((res) => res.json());
  const tokens = await fetch(`${COGNITO_POOL_ENDPOINT}/oauth2/token`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      grant_type: 'authorization_code',
      code: user.authorizationCode,
      client_id: COGNITO_USER_POOL_CLIENT_ID,
      redirect_uri: 'https://example.com',
      code_verifier: codeVerifier,
    }),
  }).then((res) => res.json());

  const cookie = `${COOKIE_NAMES.idToken}=${tokens.id_token};${COOKIE_NAMES.accessToken}=${tokens.access_token}`;
  const agent = axios.create({ baseURL, headers: { cookie, 'Content-Type': 'text/plain' } });

  agent.interceptors.response.use(undefined, (err) =>
    Promise.reject(axios.isAxiosError(err) ? new Error(JSON.stringify(err.toJSON())) : err),
  );

  return api(aspida(agent));
};
