// ConsentKeys OIDC integration for BetterAuth
// This implements a custom OAuth flow for ConsentKeys with production-ready error handling

interface ConsentKeysConfig {
  clientId: string;
  clientSecret: string;
  discoveryUrl: string;
  redirectUrl: string;
}

interface OIDCDiscovery {
  authorization_endpoint: string;
  token_endpoint: string;
  userinfo_endpoint: string;
  issuer: string;
  jwks_uri: string;
}

interface TokenResponse {
  access_token: string;
  id_token?: string;
  refresh_token?: string;
  token_type: string;
  expires_in: number;
  scope?: string;
}

interface UserInfo {
  sub: string;
  email?: string;
  email_verified?: boolean;
  name?: string;
  given_name?: string;
  family_name?: string;
  picture?: string;
  preferred_username?: string;
}

export class ConsentKeysOIDCError extends Error {
  constructor(
    message: string,
    public code: string,
    public details?: any
  ) {
    super(message);
    this.name = 'ConsentKeysOIDCError';
  }
}

export class ConsentKeysOIDC {
  private config: ConsentKeysConfig;
  private discovery: OIDCDiscovery | null = null;
  private discoveryPromise: Promise<OIDCDiscovery> | null = null;

  constructor(config: ConsentKeysConfig) {
    this.validateConfig(config);
    this.config = config;
  }

  private validateConfig(config: ConsentKeysConfig): void {
    const required = [
      'clientId',
      'clientSecret',
      'discoveryUrl',
      'redirectUrl',
    ];
    const missing = required.filter(
      (key) => !config[key as keyof ConsentKeysConfig]
    );

    if (missing.length > 0) {
      throw new ConsentKeysOIDCError(
        `Missing required ConsentKeys configuration: ${missing.join(', ')}`,
        'INVALID_CONFIG',
        { missing }
      );
    }

    // Validate URLs
    try {
      new URL(config.discoveryUrl);
      new URL(config.redirectUrl);
    } catch (error) {
      throw new ConsentKeysOIDCError(
        'Invalid URL in ConsentKeys configuration',
        'INVALID_URL',
        { error }
      );
    }
  }

  async getDiscovery(): Promise<OIDCDiscovery> {
    if (this.discovery) {
      return this.discovery;
    }

    // Prevent multiple simultaneous discovery requests
    if (this.discoveryPromise) {
      return this.discoveryPromise;
    }

    this.discoveryPromise = this.fetchDiscovery();
    return this.discoveryPromise;
  }

  private async fetchDiscovery(): Promise<OIDCDiscovery> {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout

      const response = await fetch(this.config.discoveryUrl, {
        signal: controller.signal,
        headers: {
          Accept: 'application/json',
        },
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new ConsentKeysOIDCError(
          `Failed to fetch OIDC discovery: ${response.status} ${response.statusText}`,
          'DISCOVERY_FAILED',
          { status: response.status, statusText: response.statusText }
        );
      }

      this.discovery = await response.json();

      // Validate required endpoints
      const requiredEndpoints = [
        'authorization_endpoint',
        'token_endpoint',
        'userinfo_endpoint',
        'issuer',
      ];
      const missingEndpoints = requiredEndpoints.filter(
        (endpoint) => !this.discovery![endpoint as keyof OIDCDiscovery]
      );

      if (missingEndpoints.length > 0) {
        throw new ConsentKeysOIDCError(
          `OIDC discovery document missing required endpoints: ${missingEndpoints.join(', ')}`,
          'INVALID_DISCOVERY',
          { missing: missingEndpoints }
        );
      }

      console.log('OIDC Discovery loaded successfully:', {
        issuer: this.discovery?.issuer,
        authorization_endpoint: this.discovery?.authorization_endpoint,
        token_endpoint: this.discovery?.token_endpoint,
        userinfo_endpoint: this.discovery?.userinfo_endpoint,
      });

      if (!this.discovery) {
        throw new ConsentKeysOIDCError(
          'Discovery data is null after loading',
          'DISCOVERY_NULL'
        );
      }

      return this.discovery;
    } catch (error) {
      this.discoveryPromise = null; // Reset to allow retry

      if (error instanceof ConsentKeysOIDCError) {
        throw error;
      }

      if (error instanceof Error && error.name === 'AbortError') {
        throw new ConsentKeysOIDCError(
          'OIDC discovery request timed out',
          'DISCOVERY_TIMEOUT'
        );
      }

      throw new ConsentKeysOIDCError(
        'Failed to fetch OIDC discovery document',
        'DISCOVERY_ERROR',
        { error: error instanceof Error ? error.message : String(error) }
      );
    }
  }

  async getAuthorizationUrl(state: string, nonce: string): Promise<string> {
    if (!state || !nonce) {
      throw new ConsentKeysOIDCError(
        'State and nonce are required for authorization',
        'MISSING_PARAMETERS'
      );
    }

    const discovery = await this.getDiscovery();

    const params = new URLSearchParams({
      client_id: this.config.clientId,
      redirect_uri: this.config.redirectUrl,
      response_type: 'code',
      scope: 'openid profile email',
      state,
      nonce,
    });

    const authUrl = `${discovery.authorization_endpoint}?${params.toString()}`;

    console.log('ConsentKeys Authorization URL generated:', {
      client_id: this.config.clientId,
      redirect_uri: this.config.redirectUrl,
      authorization_endpoint: discovery.authorization_endpoint,
      state_length: state.length,
      nonce_length: nonce.length,
    });

    return authUrl;
  }

  async exchangeCodeForTokens(
    code: string,
    state: string
  ): Promise<TokenResponse> {
    if (!code) {
      throw new ConsentKeysOIDCError(
        'Authorization code is required',
        'MISSING_CODE'
      );
    }

    const discovery = await this.getDiscovery();

    const tokenRequestBody = new URLSearchParams({
      grant_type: 'authorization_code',
      code,
      redirect_uri: this.config.redirectUrl,
      client_id: this.config.clientId,
      client_secret: this.config.clientSecret,
    });

    console.log('Token exchange request:', {
      endpoint: discovery.token_endpoint,
      client_id: this.config.clientId,
      redirect_uri: this.config.redirectUrl,
      grant_type: 'authorization_code',
      code_preview: code.substring(0, 10) + '...',
    });

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 15000); // 15 second timeout

      const tokenResponse = await fetch(discovery.token_endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          Accept: 'application/json',
        },
        body: tokenRequestBody,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!tokenResponse.ok) {
        const errorText = await tokenResponse.text();
        let errorData;
        try {
          errorData = JSON.parse(errorText);
        } catch {
          errorData = { error: errorText };
        }

        console.error('Token exchange failed:', {
          status: tokenResponse.status,
          statusText: tokenResponse.statusText,
          error: errorData,
        });

        throw new ConsentKeysOIDCError(
          `Token exchange failed: ${errorData.error || errorData.error_description || 'Unknown error'}`,
          'TOKEN_EXCHANGE_FAILED',
          {
            status: tokenResponse.status,
            error: errorData,
          }
        );
      }

      const tokens: TokenResponse = await tokenResponse.json();

      // Validate token response
      if (!tokens.access_token) {
        throw new ConsentKeysOIDCError(
          'Token response missing access_token',
          'INVALID_TOKEN_RESPONSE',
          { tokens }
        );
      }

      console.log('Token exchange successful:', {
        has_access_token: !!tokens.access_token,
        has_id_token: !!tokens.id_token,
        has_refresh_token: !!tokens.refresh_token,
        token_type: tokens.token_type,
        expires_in: tokens.expires_in,
        scope: tokens.scope,
      });

      return tokens;
    } catch (error) {
      if (error instanceof ConsentKeysOIDCError) {
        throw error;
      }

      if (error instanceof Error && error.name === 'AbortError') {
        throw new ConsentKeysOIDCError(
          'Token exchange request timed out',
          'TOKEN_EXCHANGE_TIMEOUT'
        );
      }

      throw new ConsentKeysOIDCError(
        'Token exchange request failed',
        'TOKEN_EXCHANGE_ERROR',
        { error: error instanceof Error ? error.message : String(error) }
      );
    }
  }

  async getUserInfo(accessToken: string): Promise<UserInfo> {
    if (!accessToken) {
      throw new ConsentKeysOIDCError(
        'Access token is required',
        'MISSING_ACCESS_TOKEN'
      );
    }

    const discovery = await this.getDiscovery();

    // ConsentKeys requires HTTPS for userinfo endpoint despite HTTP in discovery document
    const httpsUserinfoEndpoint = discovery.userinfo_endpoint.replace(
      'http://',
      'https://'
    );

    console.log('UserInfo request:', {
      original_endpoint: discovery.userinfo_endpoint,
      https_endpoint: httpsUserinfoEndpoint,
      has_access_token: !!accessToken,
      token_preview: accessToken.substring(0, 10) + '...',
    });

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout

      const userInfoResponse = await fetch(httpsUserinfoEndpoint, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          Accept: 'application/json',
        },
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!userInfoResponse.ok) {
        const errorText = await userInfoResponse.text();
        let errorData;
        try {
          errorData = JSON.parse(errorText);
        } catch {
          errorData = { error: errorText };
        }

        console.error('UserInfo request failed:', {
          status: userInfoResponse.status,
          statusText: userInfoResponse.statusText,
          error: errorData,
          endpoint_used: httpsUserinfoEndpoint,
        });

        throw new ConsentKeysOIDCError(
          `Failed to fetch user info: ${errorData.error || 'Unknown error'}`,
          'USERINFO_FAILED',
          {
            status: userInfoResponse.status,
            error: errorData,
          }
        );
      }

      const userInfo: UserInfo = await userInfoResponse.json();

      // Validate user info response
      if (!userInfo.sub) {
        throw new ConsentKeysOIDCError(
          'UserInfo response missing required "sub" claim',
          'INVALID_USERINFO',
          { userInfo }
        );
      }

      console.log('UserInfo successful:', {
        sub: userInfo.sub,
        email: userInfo.email,
        email_verified: userInfo.email_verified,
        name: userInfo.name,
        has_picture: !!userInfo.picture,
      });

      return userInfo;
    } catch (error) {
      if (error instanceof ConsentKeysOIDCError) {
        throw error;
      }

      if (error instanceof Error && error.name === 'AbortError') {
        throw new ConsentKeysOIDCError(
          'UserInfo request timed out',
          'USERINFO_TIMEOUT'
        );
      }

      throw new ConsentKeysOIDCError(
        'UserInfo request failed',
        'USERINFO_ERROR',
        { error: error instanceof Error ? error.message : String(error) }
      );
    }
  }

  /**
   * Generate a cryptographically secure random string for state/nonce
   */
  generateRandomString(length: number = 32): string {
    const array = new Uint8Array(length);
    if (typeof crypto !== 'undefined' && crypto.getRandomValues) {
      crypto.getRandomValues(array);
    } else {
      // Fallback for Node.js environments
      const nodeCrypto = require('crypto');
      nodeCrypto.randomFillSync(array);
    }
    return Array.from(array, (byte) => byte.toString(16).padStart(2, '0')).join(
      ''
    );
  }
}

/**
 * Initialize ConsentKeys OIDC client with environment validation
 */
function createConsentKeysOIDC(): ConsentKeysOIDC {
  const config = {
    clientId: process.env.CONSENTKEYS_CLIENT_ID || '',
    clientSecret: process.env.CONSENTKEYS_CLIENT_SECRET || '',
    discoveryUrl: process.env.CONSENTKEYS_DISCOVERY_URL || '',
    redirectUrl: process.env.CONSENTKEYS_REDIRECT_URL || '',
  };

  // Validate environment variables
  const missing = Object.entries(config)
    .filter(([_, value]) => !value)
    .map(([key]) => key);

  if (missing.length > 0) {
    console.error(
      `Missing required ConsentKeys environment variables: ${missing.join(', ')}`
    );
    throw new ConsentKeysOIDCError(
      `Missing required environment variables: ${missing.join(', ')}`,
      'MISSING_ENV_VARS',
      { missing }
    );
  }

  return new ConsentKeysOIDC(config);
}

export const consentKeysOIDC = createConsentKeysOIDC();
