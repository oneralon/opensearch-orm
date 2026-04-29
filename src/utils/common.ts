import { ClassType } from '../types/Class.type';
import { EsException } from '../exceptions/EsException';

interface ResponseError extends Error {
  meta?: { body?: string };
}

function isResponseError(error: Error | ResponseError): error is ResponseError {
  return typeof (error as ResponseError).meta?.body === 'string';
}

export function makeEsException(
  error: Error,
  exceptionType: ClassType<EsException> = EsException,
): EsException {
  if (error instanceof EsException) {
    return error;
  }
  if (isResponseError(error)) {
    const exception = new exceptionType(error.meta.body);
    exception.originalError = error;
    return exception;
  }
  const exception = new exceptionType(error.message);
  exception.originalError = error;
  return exception;
}

export function handleEsException(
  error: Error,
  exceptionType: ClassType<EsException> = EsException,
): never {
  throw makeEsException(error, exceptionType);
}
