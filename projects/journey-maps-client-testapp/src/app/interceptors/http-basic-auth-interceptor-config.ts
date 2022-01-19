import {InjectionToken} from '@angular/core';

/**
 * HttpBasicAuthInterceptor configuration including the service urls to force the basic auth popup on cross-origin requests.
 * By default, 'geo.sbb.ch', 'geo-int.sbb.ch' and 'geo-dev.sbb.ch'.
 */
export const HTTP_BASIC_AUTH_INTERCEPTOR_CONFIG_TOKEN = new InjectionToken<HttpBasicAuthInterceptorConfig>('{}');

export interface HttpBasicAuthInterceptorConfig {
  serviceUrls: string[];
}
