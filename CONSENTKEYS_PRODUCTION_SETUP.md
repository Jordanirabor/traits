# ConsentKeys OIDC Production Setup Checklist

This document provides a comprehensive checklist for deploying the ConsentKeys OIDC integration to production.

## Pre-Deployment Checklist

### 1. ConsentKeys Provider Configuration

- [ ] Log in to ConsentKeys dashboard
- [ ] Create or select your OIDC client application
- [ ] Configure production callback URLs:
  - [ ] Authorization callback: `https://your-domain.com/api/auth/callback/consentkeys`
  - [ ] Logout redirect: `https://your-domain.com/login`
- [ ] Verify client credentials (Client ID and Client Secret)
- [ ] Ensure OIDC scopes include: `openid`, `profile`, `email`
- [ ] Test discovery endpoint is accessible: `https://api.pseudoidc.consentkeys.com/.well-known/openid-configuration`

### 2. Environment Variables

Update your production environment variables:

```bash
# ConsentKeys OIDC Provider
CONSENTKEYS_CLIENT_ID=your_production_client_id
CONSENTKEYS_CLIENT_SECRET=your_production_client_secret
CONSENTKEYS_DISCOVERY_URL=https://api.pseudoidc.consentkeys.com/.well-known/openid-configuration
CONSENTKEYS_REDIRECT_URL=https://your-domain.com/api/auth/callback/consentkeys

# Application
NEXT_PUBLIC_APP_URL=https://your-domain.com
NODE_ENV=production

# Database
DATABASE_URL=postgresql://username:password@production-host:5432/personality_insights

# Auth Secret (generate new one for production)
AUTH_SECRET=<generate-with-openssl-rand-base64-32>
```

**Important Security Notes:**

- [ ] Generate a new `AUTH_SECRET` for production (never reuse development secrets)
- [ ] Use strong database credentials
- [ ] Store secrets securely (use environment variable management service)
- [ ] Never commit production secrets to version control

### 3. Database Setup

- [ ] Create production PostgreSQL database
- [ ] Run database migrations:
  ```bash
  npm run db:migrate
  ```
- [ ] Verify all tables are created:
  - [ ] `user` table
  - [ ] `session` table
  - [ ] `account` table
  - [ ] `verification` table
  - [ ] `personality_profiles` table
  - [ ] `analysis_results` table
- [ ] Set up database backups
- [ ] Configure database connection pooling
- [ ] Set up database monitoring

### 4. SSL/TLS Configuration

- [ ] Obtain SSL certificate for your domain
- [ ] Configure HTTPS on your hosting platform
- [ ] Verify SSL certificate is valid and trusted
- [ ] Test HTTPS redirect (HTTP → HTTPS)
- [ ] Verify secure cookie settings work correctly

### 5. Security Configuration

- [ ] Verify `NODE_ENV=production` is set
- [ ] Confirm secure cookies are enabled (automatic in production)
- [ ] Test CSRF protection (state parameter validation)
- [ ] Verify HTTP-only cookies are set
- [ ] Test SameSite cookie attribute
- [ ] Review and update CORS settings if needed
- [ ] Configure Content Security Policy (CSP) headers
- [ ] Set up rate limiting for authentication endpoints

### 6. Error Handling & Monitoring

- [ ] Set up error monitoring (e.g., Sentry, LogRocket)
- [ ] Configure logging service
- [ ] Set up alerts for authentication failures
- [ ] Monitor session creation/deletion rates
- [ ] Track token exchange failures
- [ ] Set up uptime monitoring

### 7. Testing in Production

- [ ] Test complete authentication flow:
  - [ ] Navigate to `/login`
  - [ ] Click "Sign in with ConsentKeys"
  - [ ] Complete authentication
  - [ ] Verify redirect to dashboard
  - [ ] Verify session persistence
  - [ ] Test logout functionality
- [ ] Test error scenarios:
  - [ ] Invalid state parameter
  - [ ] Expired authorization code
  - [ ] Network timeout
  - [ ] Database connection failure
- [ ] Test on multiple browsers:
  - [ ] Chrome
  - [ ] Firefox
  - [ ] Safari
  - [ ] Edge
- [ ] Test on mobile devices:
  - [ ] iOS Safari
  - [ ] Android Chrome

## Deployment Steps

### Step 1: Deploy Application

```bash
# Build the application
npm run build

# Deploy to your hosting platform (e.g., Vercel)
vercel --prod

# Or deploy to your custom server
npm start
```

### Step 2: Verify Deployment

- [ ] Application is accessible at production URL
- [ ] All static assets load correctly
- [ ] API routes are accessible
- [ ] Database connection is working

### Step 3: Configure ConsentKeys

1. Log in to ConsentKeys dashboard
2. Navigate to your OIDC client configuration
3. Update callback URLs to production URLs
4. Save configuration
5. Test authentication flow

### Step 4: Test Authentication

1. Open production URL in incognito/private window
2. Navigate to `/login`
3. Click "Sign in with ConsentKeys"
4. Complete authentication flow
5. Verify successful login and redirect
6. Check browser developer tools for any errors
7. Verify session cookie is set correctly

### Step 5: Monitor Initial Traffic

- [ ] Monitor error logs for first 24 hours
- [ ] Check authentication success rate
- [ ] Monitor database performance
- [ ] Track session creation/expiration
- [ ] Review any error reports

## Post-Deployment

### Maintenance Tasks

#### Daily

- [ ] Review error logs
- [ ] Check authentication success rate
- [ ] Monitor database performance

#### Weekly

- [ ] Review session statistics
- [ ] Check for expired sessions (cleanup runs automatically)
- [ ] Review security alerts
- [ ] Update dependencies if needed

#### Monthly

- [ ] Review and rotate secrets if needed
- [ ] Audit user accounts
- [ ] Review access logs
- [ ] Update documentation

### Performance Optimization

- [ ] Enable database query caching
- [ ] Optimize session queries
- [ ] Configure CDN for static assets
- [ ] Enable HTTP/2 or HTTP/3
- [ ] Implement Redis for session storage (optional)

### Security Hardening

- [ ] Enable security headers:
  - [ ] `Strict-Transport-Security`
  - [ ] `X-Content-Type-Options`
  - [ ] `X-Frame-Options`
  - [ ] `X-XSS-Protection`
  - [ ] `Content-Security-Policy`
- [ ] Set up Web Application Firewall (WAF)
- [ ] Configure rate limiting
- [ ] Enable DDoS protection
- [ ] Set up intrusion detection

## Troubleshooting

### Common Production Issues

#### Issue: "State verification failed"

**Symptoms:**

- Users redirected to login with error message
- Console shows state mismatch

**Possible Causes:**

1. Cookie not being set due to SameSite restrictions
2. Cookie being cleared by browser
3. Multiple authentication attempts in parallel

**Solutions:**

1. Verify cookie settings in production
2. Check browser console for cookie warnings
3. Ensure HTTPS is properly configured
4. Review SameSite cookie attribute

#### Issue: "Token exchange failed"

**Symptoms:**

- Authentication fails after ConsentKeys redirect
- Error in logs about token exchange

**Possible Causes:**

1. Incorrect client credentials
2. Redirect URL mismatch
3. Network connectivity issues
4. ConsentKeys service issues

**Solutions:**

1. Verify `CONSENTKEYS_CLIENT_ID` and `CONSENTKEYS_CLIENT_SECRET`
2. Ensure `CONSENTKEYS_REDIRECT_URL` matches exactly in ConsentKeys config
3. Check network connectivity to ConsentKeys API
4. Review ConsentKeys service status

#### Issue: "Database connection failed"

**Symptoms:**

- Authentication succeeds but profile sync fails
- Error about database connection

**Possible Causes:**

1. Incorrect database credentials
2. Database server not accessible
3. Connection pool exhausted
4. Database migrations not run

**Solutions:**

1. Verify `DATABASE_URL` is correct
2. Check database server is running and accessible
3. Review connection pool settings
4. Run database migrations

#### Issue: "Session not persisting"

**Symptoms:**

- User logged out after page refresh
- Session cookie not being set

**Possible Causes:**

1. Cookie settings incorrect
2. Session not being created in database
3. Session expiration too short

**Solutions:**

1. Verify cookie settings (secure, httpOnly, sameSite)
2. Check session creation in database
3. Review session expiration settings

## Rollback Plan

If issues occur in production:

### Immediate Actions

1. **Revert to previous deployment:**

   ```bash
   vercel rollback
   # or your platform's rollback command
   ```

2. **Disable ConsentKeys authentication:**
   - Comment out ConsentKeys routes temporarily
   - Enable guest access only
   - Display maintenance message

3. **Notify users:**
   - Display banner about authentication issues
   - Provide alternative access method if available

### Investigation

1. Review error logs
2. Check ConsentKeys service status
3. Verify environment variables
4. Test authentication flow in staging
5. Identify root cause

### Resolution

1. Fix identified issues
2. Test thoroughly in staging
3. Deploy fix to production
4. Monitor closely
5. Document incident and resolution

## Support Contacts

- **ConsentKeys Support:** [ConsentKeys documentation/support]
- **Hosting Platform:** [Your hosting platform support]
- **Database Provider:** [Your database provider support]
- **Internal Team:** [Your team contact information]

## Additional Resources

- [ConsentKeys OIDC Documentation](https://consentkeys.com/docs)
- [Next.js Deployment Documentation](https://nextjs.org/docs/deployment)
- [PostgreSQL Production Best Practices](https://www.postgresql.org/docs/current/admin.html)
- [OWASP Authentication Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html)

## Compliance & Privacy

- [ ] Review GDPR compliance requirements
- [ ] Ensure privacy policy is updated
- [ ] Configure data retention policies
- [ ] Set up user data export functionality
- [ ] Implement user data deletion functionality
- [ ] Review age verification requirements (users 14+)
- [ ] Ensure age-appropriate privacy notices

## Success Criteria

Your production deployment is successful when:

- ✅ Users can successfully authenticate with ConsentKeys
- ✅ Sessions persist across page refreshes
- ✅ Logout works correctly
- ✅ No authentication errors in logs
- ✅ Database queries are performant
- ✅ Security headers are properly configured
- ✅ Monitoring and alerts are active
- ✅ All tests pass in production environment

## Sign-off

- [ ] Development team approval
- [ ] Security team approval
- [ ] Operations team approval
- [ ] Product owner approval

**Deployment Date:** ******\_\_\_******

**Deployed By:** ******\_\_\_******

**Verified By:** ******\_\_\_******

---

**Note:** This checklist should be reviewed and updated regularly as the application evolves and new security best practices emerge.
