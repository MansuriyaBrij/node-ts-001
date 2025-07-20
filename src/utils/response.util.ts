import { Response } from 'express';
import path from 'path';
import fs from 'fs';

interface SuccessOptions<T> {
  res: Response;
  data?: T;
  message?: string;
  statusCode?: number;
}

interface ErrorOptions {
  res: Response;
  message?: string;
  errors?: any;
  statusCode?: number;
}

export class ResponseHandler {
  static success<T>({
    res,
    data,
    message = 'Success',
    statusCode = 200,
  }: SuccessOptions<T>) {
    return res.status(statusCode).json({
      status: true,
      message,
      data,
    });
  }

  static error({
    res,
    message = 'Something went wrong',
    errors = null,
    statusCode = 400,
  }: ErrorOptions) {
    return res.status(statusCode).json({
      status: false,
      message,
      errors,
    });
  }

  static file(
    res: Response,
    filePath: string,
    downloadName?: string
  ) {
    if (!fs.existsSync(filePath)) {
      return this.error({
        res,
        message: 'File not found',
        statusCode: 404,
      });
    }

    const fullPath = path.resolve(filePath);
    return downloadName
      ? res.download(fullPath, downloadName)
      : res.sendFile(fullPath);
  }
}
