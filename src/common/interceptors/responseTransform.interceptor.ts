// src/common/interceptors/response-transform.interceptor.ts
import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

@Injectable()
export class ResponseTransformInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map((data) => {
        // Wrap successful responses
        return { success: true, data };
      }),
      catchError((err) => {
        // Handle errors
        const status = err.status || HttpStatus.INTERNAL_SERVER_ERROR;
        const message =
          err.response?.message || err.message || 'Unexpected error occurred';
        return throwError(
          () => new HttpException({ success: false, message }, status),
        );
      }),
    );
  }
}
