import {Observable, OperatorFunction} from 'rxjs';
import {buffer, debounceTime, throttleTime} from 'rxjs/operators';

export function bufferDebounce<T>(debounce: number): OperatorFunction<T, T[]> {
  return (source: Observable<T>): Observable<T[]> => new Observable(observer => {
    const subscription = source.pipe(buffer(source.pipe( throttleTime(debounce + 10), debounceTime(debounce)))).subscribe({
      next(x): void {
        observer.next(x);
      },
      error(err): void {
        observer.error(err);
      },
      complete(): void {
        observer.complete();
      },
    });
    return () => subscription.unsubscribe();
  });
}
