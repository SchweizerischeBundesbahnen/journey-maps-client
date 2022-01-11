import {InjectionToken} from '@angular/core';
import {HttpBasicAuthInterceptorConfig} from '../models/http-basic-auth-interceptor-config';

export const HTTP_BASIC_AUTH_INTERCEPTOR_CONFIG_TOKEN = new InjectionToken<HttpBasicAuthInterceptorConfig>('{}');
