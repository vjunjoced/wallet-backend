import { ExceptionFilter, Catch, ArgumentsHost, HttpException } from '@nestjs/common';
import { AppError } from '@class/app-error';

@Catch()
export class HttpErrorFilter implements ExceptionFilter {
  catch(exception: HttpException | AppError | Error, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    let status: number;
    const errorResponse: any = {
      timestamp: new Date().toLocaleDateString()
    };

    if (exception instanceof AppError) {
      status = exception.httpStatus;
      errorResponse.codeError = exception.code;
      // eslint-disable-next-line @typescript-eslint/camelcase
      errorResponse.message = {
        message: exception.msg,
        // eslint-disable-next-line @typescript-eslint/camelcase
        codeError: exception.code
      };
    } else if (exception instanceof Error) {
      if (exception['response']) {
        status = exception['status'] || 400;
        errorResponse.message = exception['response'];
        // tslint:disable-next-line: no-string-literal
      } else if (exception.message && exception['message']['error']) {
        // tslint:disable-next-line: no-string-literal
        status = exception['status'];
        // tslint:disable-next-line: no-string-literal
        errorResponse.message = exception['message'];
      } else {
        errorResponse.message = exception.message || exception.stack;
        status = 500;
      }
    } else if (exception['isErrorBadRequest']) {
      status = 400;
      errorResponse.message = {
        errors: exception['errors'],
        result: false,
        error: 'Bad Request',
        codeError: 'bad_request'
      };
    } else {
      status = 500;
      const err: HttpException = exception as HttpException;
      errorResponse.message = err.message || err.message || null;
    }

    response.status(status).send(errorResponse.message);
  }
}
