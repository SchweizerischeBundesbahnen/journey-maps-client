import {Observable, OperatorFunction} from 'rxjs';
import {buffer, debounceTime, throttleTime} from 'rxjs/operators';

// CHECKME ses: Better name

// Upon receiving the first value this operator buffers all values for <dueTime> milliseconds
// and then emits them as an array.
export function bufferTimeOnValue<T>(dueTime: number): OperatorFunction<T, T[]> {
  return (source: Observable<T>): Observable<T[]> => new Observable(subscriber => {
    return source.pipe(
      buffer(source.pipe(
        // CHECKME ses: Does it also work for edge cases?
        //  (e.g. new value shortly after buffer released)
        throttleTime(dueTime),
        debounceTime(dueTime))
      )
    ).subscribe({
      next(x): void {
        subscriber.next(x);
      },
      error(err): void {
        subscriber.error(err);
      },
      complete(): void {
        subscriber.complete();
      },
    });
  });
}
