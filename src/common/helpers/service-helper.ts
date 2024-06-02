import {
  NotFoundException,
  InternalServerErrorException,
  HttpStatus,
  HttpException,
} from '@nestjs/common';

export async function handleDatabaseOperation<T>(
  operation: Promise<T>,
  errorMessage: string,
  notFoundMessage: string = 'Resource not found',
  errorCode: HttpStatus = HttpStatus.INTERNAL_SERVER_ERROR,
  notFoundCode: HttpStatus = HttpStatus.NOT_FOUND,
): Promise<T> {
  try {
    const result = await operation;
    if (result === null) {
      // Make sure to check for null explicitly
      if (notFoundCode === HttpStatus.NOT_FOUND) {
        throw new NotFoundException(notFoundMessage);
      } else {
        throw new HttpException(notFoundMessage, notFoundCode);
      }
    }
    return result;
  } catch (error) {
    if (error instanceof HttpException) {
      throw error;
    }

    console.error('Database Operation Error:', error);

    console.log(error.name);

    // Re-throw the error if it's already an HttpException with a status code
    if (error instanceof HttpException) {
      throw error;
    }

    if (error.name === 'ValidationError') {
      throw new InternalServerErrorException(
        errorMessage || 'Validation error',
      );
    }

    // Default error handling: throw as internal server error
    throw new InternalServerErrorException(
      errorMessage || 'Database operation failed',
      error.message,
    );
  }
}
