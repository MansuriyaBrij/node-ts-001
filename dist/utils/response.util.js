import path from 'path';
import fs from 'fs';
export class ResponseHandler {
    static success({ res, data, message = 'Success', statusCode = 200, }) {
        return res.status(statusCode).json({
            status: true,
            message,
            data,
        });
    }
    static error({ res, message = 'Something went wrong', errors = null, statusCode = 400, }) {
        return res.status(statusCode).json({
            status: false,
            message,
            errors,
        });
    }
    static file(res, filePath, downloadName) {
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
