import { Request } from 'express';
export declare class UploadController {
    uploadFile(file: Express.Multer.File, req: Request): Promise<{
        url: string;
        mimetype: string;
        originalName: string;
    }>;
}
