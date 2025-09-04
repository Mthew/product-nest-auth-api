import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';
import { Request, Response } from 'express';

// Define the structure of the error response body
interface ErrorResponse {
  statusCode: number;
  timestamp: string;
  path: string;
  message: string | object; // Can be string or validation error object
  details?: any; // Optional field for more details or stack in dev
}

@Catch() // Catch all exceptions if no specific type is provided
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger(AllExceptionsFilter.name); // Instantiate logger

  // Inject HttpAdapterHost to get the underlying HTTP adapter (Express/Fastify)
  constructor(private readonly httpAdapterHost: HttpAdapterHost) {}

  catch(exception: unknown, host: ArgumentsHost): void {
    const { httpAdapter } = this.httpAdapterHost;
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>(); // Get express response object
    const request = ctx.getRequest<Request>(); // Get express request object

    // Determine HTTP status code
    const httpStatus =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR; // Default to 500 for unknown errors

    // Determine error message(s)
    let errorMessage: string | object;
    let errorDetails: any = null; // Initialize details

    if (exception instanceof HttpException) {
      const exceptionResponse = exception.getResponse();
      // Handle NestJS validation pipe errors (which return an object)
      if (
        typeof exceptionResponse === 'object' &&
        exceptionResponse !== null &&
        'message' in exceptionResponse
      ) {
        errorMessage = (exceptionResponse as any).message; // Often an array of validation errors
        errorDetails = exceptionResponse; // Keep the original validation structure in details
      } else {
        // Handle standard HttpException strings
        errorMessage = exceptionResponse;
      }
    } else if (exception instanceof Error) {
      // Handle generic JavaScript errors
      errorMessage = exception.message;
      // Optionally include stack trace in details during development
      if (process.env.NODE_ENV !== 'production') {
        errorDetails = { name: exception.name, stack: exception.stack };
      }
    } else {
      // Handle non-Error exceptions (e.g., strings thrown)
      errorMessage = 'An unexpected error occurred';
      if (process.env.NODE_ENV !== 'production') {
        errorDetails = exception; // Show the raw exception in dev
      }
    }

    // Construct the response body
    const responseBody: ErrorResponse = {
      statusCode: httpStatus,
      timestamp: new Date().toISOString(),
      path: httpAdapter.getRequestUrl(request), // Use adapter method for portability
      message: errorMessage,
      details: errorDetails, // Include details field
    };

    // Log the error, especially for 500 errors
    if (httpStatus >= 500) {
      this.logger.error(
        `[${request.method} ${request.url}] - Status ${httpStatus} - ${exception instanceof Error ? exception.stack : JSON.stringify(exception)}`,
        (exception as Error)?.stack, // Pass stack explicitly if it's an Error
        'ExceptionFilter', // Context for logger
      );
      // In production, you might want to hide the specific message for 500 errors
      if (
        process.env.NODE_ENV === 'production' &&
        !(exception instanceof HttpException)
      ) {
        responseBody.message = 'Internal Server Error';
        responseBody.details = undefined; // Don't expose details in prod for 500s
      }
    } else {
      // Log non-500 errors (like validation or not found) with less severity
      this.logger.warn(
        `[${request.method} ${request.url}] - Status ${httpStatus} - ${JSON.stringify(responseBody.message)}`,
        'ExceptionFilter',
      );
    }

    // Send the response using the HTTP adapter
    httpAdapter.reply(response, responseBody, httpStatus);
  }
}
