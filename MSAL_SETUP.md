# MSAL Authentication Setup

This Angular 20 application uses Microsoft Authentication Library (MSAL) for Azure Active Directory authentication.

## Configuration

### Azure AD App Registration
- **Client ID**: `9f31697a-b36a-4e2c-85b5-607d9c4283f4`
- **Tenant ID**: `b210c743-80a7-4519-985b-d870f711a83e`
- **Redirect URI**: `http://localhost:4200`

### Files Created

1. **src/app/config/msal.config.ts**
   - MSAL configuration with Azure AD credentials
   - Login request scopes
   - Protected resources configuration
   - Factory functions for MSAL services

2. **src/app/components/login/login.ts**
   - Full-screen login component
   - Sign In button with Microsoft authentication
   - Displays user name and email after login
   - Handles MSAL events and interaction status

3. **src/app/components/login/login.html**
   - Modern, fullscreen login UI with Material Design
   - Gradient background with animations
   - Profile display after successful login
   - Error handling display

4. **src/app/components/login/login.scss**
   - Fullscreen styling with gradient background
   - Responsive design for mobile and desktop
   - Animated login card with smooth transitions
   - Material Design components styling

5. **src/app/guards/auth.guard.ts**
   - Route protection guard
   - Redirects unauthenticated users to login page
   - SSR-compatible with browser checks

## Features

### Authentication Flow
1. User accesses protected route
2. Auth guard checks for authenticated account
3. If not authenticated, redirects to `/login`
4. User clicks "Sign In with Microsoft"
5. MSAL initiates redirect to Azure AD
6. After successful authentication, redirects back to app
7. User profile is loaded and displayed

### Protected Routes
- All routes except `/login` are protected by `authGuard`
- Unauthorized access automatically redirects to login page

### User Profile Display
After login, the application displays:
- User's full name
- User's email address
- Sign Out button

## Usage

### Running the Application

```bash
npm start
```

The application will open at `http://localhost:4200`

### First Time Login
1. Navigate to any route (will redirect to login if not authenticated)
2. Click "Sign In with Microsoft"
3. Enter your Microsoft credentials
4. Authorize the application
5. You'll be redirected back to the main application

### Signing Out
1. Click the "Sign Out" button on the login page or main layout
2. MSAL will clear the session and redirect to login page

## Security Features

- Tokens stored securely in browser localStorage
- MSAL handles token refresh automatically
- HTTP interceptor adds Bearer token to API requests
- Protected resources configured for Microsoft Graph API
- SSR-compatible with browser environment checks

## API Scopes

The application requests the following scopes:
- `user.read` - Read user profile
- `openid` - OpenID Connect
- `profile` - Basic profile information
- `email` - Email address

## Troubleshooting

### "Login failed" Error
- Check that Azure AD app is configured correctly
- Verify Client ID and Tenant ID in `msal.config.ts`
- Ensure redirect URI is registered in Azure AD

### "Not authenticated" on Refresh
- Check browser console for MSAL errors
- Clear browser cache and localStorage
- Verify MSAL instance is initialized properly

### SSR Errors
- All MSAL operations check for `typeof window !== 'undefined'`
- Auth guard allows access during SSR
- MSAL initialization skipped on server

## Azure AD App Registration Setup

To configure your own Azure AD app:

1. Go to [Azure Portal](https://portal.azure.com)
2. Navigate to Azure Active Directory > App registrations
3. Click "New registration"
4. Enter application name: "Expense Splitter"
5. Set Redirect URI: `http://localhost:4200`
6. Copy the Client ID and Tenant ID
7. Update `src/app/config/msal.config.ts` with your values
8. Under "API permissions", add:
   - Microsoft Graph > Delegated > User.Read
   - Microsoft Graph > Delegated > openid
   - Microsoft Graph > Delegated > profile
   - Microsoft Graph > Delegated > email
9. Grant admin consent for the permissions

## Production Deployment

For production:
1. Register a new redirect URI in Azure AD for your production URL
2. Update `msalConfig.auth.redirectUri` in `msal.config.ts`
3. Update `postLogoutRedirectUri` as well
4. Consider using environment variables for sensitive values
5. Enable HTTPS for secure token transmission
