import { EventEmitter, Injectable, Self } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, Subscription, timer } from 'rxjs';
import {
  debounceTime,
  delay,
  retryWhen,
  startWith,
  switchMap,
  tap,
  takeUntil
} from 'rxjs/operators';

import { environment } from '../../environments/environment';
import { ConnectionOptions } from '../types/interfaces';
import { Unsubscribe } from './unsubscribe.service';

@Injectable({
  providedIn: 'root'
})
export class CheckConnectionService {
  private _stateChange = new EventEmitter<boolean>();
  private _currentState: boolean = false;
  private _httpSub: Subscription;
  private _options: ConnectionOptions;

  constructor(private _http: HttpClient, @Self() private _destroy: Unsubscribe) {
    this._options = {
      serverUrl: environment.serverUrl,
      interval: environment.intervalCheck
    };
    this.serverStatus();
  }

  private serverStatus() {
    if (this._httpSub) {
      this._httpSub.unsubscribe();
    }

    this._httpSub = timer(0, this._options.interval)
      .pipe(
        switchMap(() =>
          this._http.head(this._options.serverUrl, {
            responseType: 'text'
          })
        ),
        retryWhen((errors) =>
          errors.pipe(
            tap((response: HttpErrorResponse) => {
              this._currentState = false;
              this.status();
            }),
            delay(10000)
          )
        ),
        takeUntil(this._destroy)
      )
      .subscribe(() => {
        this._currentState = true;
        this.status();
      });
  }

  private status() {
    this._stateChange.emit(this._currentState);
  }

  checkStatus(report_currentState = true): Observable<boolean> {
    return report_currentState
      ? this._stateChange.pipe(
          debounceTime(300),
          startWith(this._currentState)
        )
      : this._stateChange.pipe(debounceTime(1000));
  }
}
