import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';
import {Observable, throwError} from 'rxjs';
import {Inject, Injectable} from '@angular/core';
import {catchError} from 'rxjs/operators';
import {HTTP_BASIC_AUTH_INTERCEPTOR_CONFIG_TOKEN, HttpBasicAuthInterceptorConfig} from './http-basic-auth-interceptor-config';

/**
 * This http interceptor is forcing in some web browsers (e.g. Safari) to display the basic-auth popup window in cross-origin requests.
 * Use HTTP_BASIC_AUTH_INTERCEPTOR_CONFIG_TOKEN to specify the service urls to use this interceptor.
 */
@Injectable()
export class HttpBasicAuthInterceptor implements HttpInterceptor {

  private serviceUrls: string[] = [];

  constructor(@Inject(HTTP_BASIC_AUTH_INTERCEPTOR_CONFIG_TOKEN) private configs: HttpBasicAuthInterceptorConfig[]) {
    if (configs?.length) {
      this.serviceUrls.push(...[].concat(...configs.map(config => config.serviceUrls ?? [])));
    }
  }

  intercept(httpRequest: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const url = httpRequest.url;
    const shouldBasicAuth = this.serviceUrls.some(serviceUrl => url.includes(serviceUrl));

    return next.handle(httpRequest).pipe(catchError(err => {
      if (err.status === 0 && shouldBasicAuth) {
        this.forceBasicAuthDialog(url);
      }
      return throwError(err);
    }));
  }

  private forceBasicAuthDialog(url: string) {
    const iframe = document.createElement('iframe');
    iframe.attributes['id'] = 'iframe-FeatureLayerHttpBasicAuth';
    iframe.src = url;
    iframe.style.position = 'absolute';
    iframe.style.top = '0';
    iframe.style.left = '0';
    iframe.style.width = '1px';
    iframe.style.height = '1px';
    const childRef = window.document.body.appendChild(iframe);
    // Remove focus from any focused element
    if (document.activeElement) {
      // @ts-ignore
      document.activeElement.blur();
    }
    window.onfocus = () => {
      window.document.body.removeChild(childRef);
      location.reload();
    };
  }
}
