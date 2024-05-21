import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { NotFoundError } from '../error/not-found.error';
import { DuplicationError } from '../error/duplication.error';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = this.getStatus(exception);
    const message = this.getErrorMessage(exception);

    if (message instanceof Object) {
      return response.status(status).json({
        statusCode: status,
        timestamp: new Date().toISOString(),
        path: request.url,
        ...message,
      });
    }

    response.status(status).json({
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      message: message,
    });
  }

  getStatus(exception: unknown): number {
    if (exception instanceof HttpException) {
      return exception.getStatus();
    }
    switch (true) {
      case exception instanceof NotFoundError:
      case exception instanceof DuplicationError:
        return 400;
      default:
        return 500;
    }
  }

  getErrorMessage(exception: unknown): string | object {
    if (exception instanceof HttpException) {
      return exception.getResponse();
    }
    if (exception instanceof Error) {
      return exception.message;
    }
    return 'Internal server error';
  }
}
