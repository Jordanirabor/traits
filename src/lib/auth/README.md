# ConsentKeys OIDC Authentication Integration

This directory contains the complete ConsentKeys OIDC authentication implementation for the Personality Insights App.

## Overview

The authentication system uses ConsentKeys as an OIDC (OpenID Connect) provider to enable secure user authentication. The implementation includes:

- OAuth 2.0 / OIDC authorization code flow
- User profile synchronization with local database
- Session management with secure HTTP-only cookies
- Comprehensive error handling and logging
- Production-ready security features

## Architecture

```
┌─────────────┐      ┌──────────────┐      ┌─────────────┐
│   Client    │─────▶│  Next.js API │─────▶│ ConsentKeys │
│  (Browser)  │◀─────│   Routes     │◀─────│    OIDC     │
└─────────────┘      └──────────────┘      └─────────────┘
                            │
                            ▼
                     ┌──────────────┐
                     │  PostgreSQL  │
                     │   Database   │
                     └──────────────┘
```

## Files

### Core Authentication

- **`consentkeys.ts`** - ConsentKeys OIDC client implementation
  - Discovery document fetching
  - Authorization URL generation
  - Token exchange
  - User info retrieval
  - Error handling with custom error types

- **`session.ts`** - Session management utilities
  - Session creation and validation
  - Session retrieval from cookies
  - Session cleanup and logout
  - Authentication guards

### API Routes

- **`/api/auth/consentkeys`** - Authentication initiation
  - Generates state and nonce for CSRF protection
  - Redirects to ConsentKeys authorization endpoint
  - Sets secure cookies for state verification

- **`/api/auth/callback/consentkeys`** - OAuth callback handler
  - Validates state parameter (CSRF protection)
  - Exchanges authorization code for tokens
  - Retrieves user information
  - Synchronizes user profile with database
  - Creates session and sets session cookie

- **`/api/auth/session`** - Session retrieval endpoint
  - Returns current session data
  - Used by client-side authentication checks

- **`/api/auth/logout`** - Logout endpoint
  - Destroys session in database
  - Clears session cookies
  - Redirects to login page

## Configuration

### Environment Variables

Required environment variables (see `.env.example`):

```bash
# ConsentKeys OIDC Configuration
CONSENTKEYS_CLIENT_ID=your_client_id
CONSENTKEYS_CLIENT_SECRET=your_client_secret
CONSENTKEYS_DISCOVERY_URL=https://api.pseudoidc.consentkeys.com/.well-known/openid-configuration
CONSENTKEYS_REDIRECT_URL=http://localhost:3000/api/auth/callback/consentkeys

# Application URL
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Database
DATABASE_URL=postgresql://username:password@localhost:5432/personality_insights

# Auth Secret (generate with: openssl rand -base64 32)
AUTH_SECRET=your_secret_key_here
```

### Production Configuration

For production deployment:

1. Update `CONSENTKEYS_REDIRECT_URL` to your production domain:

   ```bash
   CONSENTKEYS_REDIRECT_URL=https://your-domain.com/api/auth/callback/consentkeys
   ```

2. Update `NEXT_PUBLIC_APP_URL` to your production domain:

   ```bash
   NEXT_PUBLIC_APP_URL=https://your-domain.com
   ```

3. Configure ConsentKeys provider with production callback URLs:
   - Authorization callback: `https://your-domain.com/api/auth/callback/consentkeys`
   - Logout redirect: `https://your-domain.com/login`

4. Ensure `NODE_ENV=production` for secure cookie settings

## Authentication Flow

### 1. Login Initiation

```typescript
// User clicks "Sign in with ConsentKeys"
window.location.href = '/api/auth/consentkeys?action=login';
```

The API route:

1. Generates cryptographically secure state and nonce
2. Stores them in HTTP-only cookies
3. Redirects to ConsentKeys authorization endpoint

### 2. User Authentication

User authenticates with ConsentKeys and is redirected back to the callback URL with an authorization code.

### 3. Callback Processing

```typescript
// /api/auth/callback/consentkeys
1. Validates state parameter (CSRF protection)
2. Exchanges authorization code for access token
3. Retrieves user information from ConsentKeys
4. Synchronizes user profile with database
5. Creates session in database
6. Sets session cookie
7. Redirects to dashboard
```

### 4. Session Management

```typescript
// Check authentication status
const session = await getSession();

if (session) {
  console.log('User:', session.user);
  console.log('Session expires:', session.session.expiresAt);
}
```

### 5. Logout

```typescript
// Logout user
await fetch('/api/auth/logout', { method: 'POST' });
```

## Database Schema

The authentication system uses the following tables:

### Users Table

```sql
CREATE TABLE "user" (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  email_verified BOOLEAN NOT NULL DEFAULT false,
  image TEXT,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);
```

### Sessions Table

```sql
CREATE TABLE "session" (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES "user"(id) ON DELETE CASCADE,
  token TEXT NOT NULL UNIQUE,
  expires_at TIMESTAMP NOT NULL,
  ip_address TEXT,
  user_agent TEXT,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);
```

### Accounts Table (OAuth)

```sql
CREATE TABLE "account" (
  id TEXT PRIMARY KEY,
  account_id TEXT NOT NULL,
  provider_id TEXT NOT NULL,
  user_id TEXT NOT NULL REFERENCES "user"(id) ON DELETE CASCADE,
  access_token TEXT,
  refresh_token TEXT,
  id_token TEXT,
  access_token_expires_at TIMESTAMP,
  scope TEXT,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);
```

## Error Handling

The implementation includes comprehensive error handling:

### Custom Error Types

```typescript
class ConsentKeysOIDCError extends Error {
  constructor(
    message: string,
    public code: string,
    public details?: any
  ) {
    super(message);
    this.name = 'ConsentKeysOIDCError';
  }
}
```

### Error Codes

- `INVALID_CONFIG` - Missing or invalid configuration
- `INVALID_URL` - Invalid URL in configuration
- `DISCOVERY_FAILED` - Failed to fetch OIDC discovery document
- `DISCOVERY_TIMEOUT` - Discovery request timed out
- `INVALID_DISCOVERY` - Discovery document missing required fields
- `MISSING_PARAMETERS` - Missing required parameters
- `MISSING_CODE` - Authorization code not provided
- `TOKEN_EXCHANGE_FAILED` - Failed to exchange code for tokens
- `TOKEN_EXCHANGE_TIMEOUT` - Token exchange timed out
- `INVALID_TOKEN_RESPONSE` - Token response missing required fields
- `MISSING_ACCESS_TOKEN` - Access token not provided
- `USERINFO_FAILED` - Failed to fetch user info
- `USERINFO_TIMEOUT` - User info request timed out
- `INVALID_USERINFO` - User info missing required fields
- `PROFILE_SYNC_FAILED` - Failed to sync user profile
- `SESSION_CREATE_FAILED` - Failed to create session

### Error Logging

All errors are logged with detailed context:

```typescript
console.error('ConsentKeys callback error:', {
  error: error.message,
  code: error.code,
  details: error.details,
  timestamp: new Date().toISOString(),
});
```

## Security Features

### CSRF Protection

- State parameter validation
- Nonce for replay attack prevention
- Secure HTTP-only cookies

### Session Security

- Cryptographically secure session tokens
- HTTP-only cookies (not accessible via JavaScript)
- Secure flag in production (HTTPS only)
- SameSite=Lax for CSRF protection
- 7-day session expiration

### Token Security

- Access tokens stored in database, not cookies
- Refresh tokens for token renewal
- Token expiration tracking

### Input Validation

- All user inputs validated
- URL validation for configuration
- Required field validation

### Timeout Protection

- 10-second timeout for discovery requests
- 15-second timeout for token exchange
- 10-second timeout for user info requests

## Usage Examples

### Protecting Routes

```typescript
// In a server component or API route
import { requireAuth } from '@/lib/auth/session';

export async function GET() {
  try {
    const session = await requireAuth();
    // User is authenticated
    return NextResponse.json({ user: session.user });
  } catch (error) {
    // User is not authenticated
    return NextResponse.json(
      { error: 'Authentication required' },
      { status: 401 }
    );
  }
}
```

### Client-Side Authentication Check

```typescript
// In a React component
import { useAuth } from '@/components/auth/AuthProvider';

function MyComponent() {
  const { session, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!session) {
    return <div>Please log in</div>;
  }

  return <div>Welcome, {session.user.name}!</div>;
}
```

### Manual Session Check

```typescript
// In a server component
import { getSession } from '@/lib/auth/session';

export default async function Page() {
  const session = await getSession();

  if (!session) {
    redirect('/login');
  }

  return <div>Welcome, {session.user.name}!</div>;
}
```

## Testing

### Local Testing

1. Ensure ConsentKeys credentials are configured in `.env.local`
2. Start the development server: `npm run dev`
3. Navigate to `/login`
4. Click "Sign in with ConsentKeys"
5. Complete authentication flow
6. Verify redirect to dashboard

### Production Testing

1. Deploy to production environment
2. Update ConsentKeys configuration with production callback URLs
3. Test complete authentication flow
4. Verify session persistence
5. Test logout functionality

## Troubleshooting

### Common Issues

**Issue: "State verification failed"**

- Cause: Cookie not being set or cleared
- Solution: Check cookie settings, ensure SameSite and Secure flags are appropriate for environment

**Issue: "Token exchange failed"**

- Cause: Invalid client credentials or redirect URL mismatch
- Solution: Verify ConsentKeys configuration, ensure redirect URL matches exactly

**Issue: "UserInfo request failed"**

- Cause: Invalid or expired access token
- Solution: Check token exchange response, verify ConsentKeys is returning valid tokens

**Issue: "Failed to synchronize user profile"**

- Cause: Database connection issue or schema mismatch
- Solution: Verify database connection, run migrations

### Debug Logging

Enable detailed logging by checking console output. All authentication steps are logged with context:

```typescript
console.log('OIDC Discovery loaded:', { ... });
console.log('Token exchange successful:', { ... });
console.log('UserInfo successful:', { ... });
console.log('User profile synchronized:', { ... });
```

## Maintenance

### Session Cleanup

Expired sessions should be cleaned up periodically:

```typescript
import { cleanupExpiredSessions } from '@/lib/auth/session';

// Run this periodically (e.g., via cron job)
const deletedCount = await cleanupExpiredSessions();
console.log(`Cleaned up ${deletedCount} expired sessions`);
```

### Token Refresh

Token refresh is not currently implemented but can be added:

```typescript
// TODO: Implement token refresh
async function refreshAccessToken(refreshToken: string) {
  // Exchange refresh token for new access token
}
```

## Future Enhancements

- [ ] Token refresh implementation
- [ ] Multi-factor authentication support
- [ ] Remember me functionality
- [ ] Session activity tracking
- [ ] Suspicious activity detection
- [ ] Rate limiting for authentication attempts
- [ ] Email verification flow
- [ ] Password reset flow (if email/password auth is added)

## Support

For issues related to:

- **ConsentKeys OIDC**: Check ConsentKeys documentation
- **Authentication flow**: Review this README and code comments
- **Database issues**: Check Drizzle ORM documentation
- **Next.js integration**: Check Next.js documentation

## License

This authentication implementation is part of the Personality Insights App.
