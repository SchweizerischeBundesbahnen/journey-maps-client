import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';
import {Observable, throwError} from 'rxjs';
import {Injectable} from '@angular/core';
import {catchError} from 'rxjs/operators';

@Injectable()
export class HttpBasicAuthInterceptor implements HttpInterceptor {
  intercept(httpRequest: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const url = httpRequest.url;
    return next.handle(httpRequest).pipe(catchError(err => {
      if (err.status === 0) {
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
      return throwError(err);
    }));
  }
}
