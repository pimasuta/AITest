import {
  MsalGuardConfiguration,
  MsalInterceptorConfiguration,
} from '@azure/msal-angular';
import {
  BrowserCacheLocation,
  InteractionType,
  IPublicClientApplication,
  LogLevel,
  PublicClientApplication,
} from '@azure/msal-browser';

export const isIE = typeof window !== 'undefined' && (window.navigator.userAgent.indexOf('MSIE ') > -1 || window.navigator.userAgent.indexOf('Trident/') > -1);

export function loggerCallback(logLevel: LogLevel, message: string) {
  console.log(message);
}

export const msalConfig = {
  auth: {
    clientId: '9f31697a-b36a-4e2c-85b5-607d9c4283f4', // Your Azure AD App Client ID
    authority: 'https://login.microsoftonline.com/b210c743-80a7-4519-985b-d870f711a83e', // Your Tenant ID
    redirectUri: typeof window !== 'undefined' ? window.location.origin : 'http://localhost:4200',
    postLogoutRedirectUri: typeof window !== 'undefined' ? window.location.origin : 'http://localhost:4200',
  },
  cache: {
    cacheLocation: BrowserCacheLocation.LocalStorage,
    storeAuthStateInCookie: isIE,
  },
  system: {
    loggerOptions: {
      loggerCallback,
      logLevel: LogLevel.Info,
      piiLoggingEnabled: false,
    },
  },
};

export const loginRequest = {
  scopes: ['user.read', 'openid', 'profile', 'email'],
};

export const protectedResources = {
  graphMe: {
    endpoint: 'https://graph.microsoft.com/v1.0/me',
    scopes: ['user.read'],
  },
};

export function MSALInstanceFactory(): IPublicClientApplication {
  return new PublicClientApplication(msalConfig);
}

export function MSALGuardConfigFactory(): MsalGuardConfiguration {
  return {
    interactionType: InteractionType.Redirect,
    authRequest: loginRequest,
    loginFailedRoute: '/login',
  };
}

export function MSALInterceptorConfigFactory(): MsalInterceptorConfiguration {
  const protectedResourceMap = new Map<string, Array<string>>();
  
  protectedResourceMap.set(protectedResources.graphMe.endpoint, protectedResources.graphMe.scopes);

  return {
    interactionType: InteractionType.Redirect,
    protectedResourceMap,
  };
}
