"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UploadController = void 0;
const common_1 = require("@nestjs/common");
const platform_express_1 = require("@nestjs/platform-express");
const multer_1 = require("multer");
const path_1 = require("path");
const fs_1 = require("fs");
const multer_exception_filter_1 = require("./multer-exception.filter");
let UploadController = class UploadController {
    async uploadFile(file, req) {
        try {
            if (!file) {
                throw new common_1.BadRequestException('Không nhận được file upload');
            }
            const uploadType = req.body.type || req.query.type || 'message';
            const date = new Date();
            const dateStr = `${date.getFullYear()}-${(date.getMonth() + 1)
                .toString()
                .padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`;
            const host = req.get('host');
            const protocol = req.protocol;
            const url = `${protocol}://${host}/uploads/${uploadType}/${dateStr}/${file.filename}`;
            return { url, mimetype: file.mimetype, originalName: file.originalname };
        }
        catch (err) {
            throw new common_1.BadRequestException(err.message || 'Upload failed');
        }
    }
};
exports.UploadController = UploadController;
__decorate([
    (0, common_1.Post)(),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('file', {
        storage: (0, multer_1.diskStorage)({
            destination: (req, file, cb) => {
                const type = req.body.type || req.query.type || 'message';
                const date = new Date();
                const dateStr = `${date.getFullYear()}-${(date.getMonth() + 1)
                    .toString()
                    .padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`;
                const uploadPath = `./uploads/${type}/${dateStr}`;
                if (!(0, fs_1.existsSync)(uploadPath)) {
                    (0, fs_1.mkdirSync)(uploadPath, { recursive: true });
                }
                cb(null, uploadPath);
            },
            filename: (req, file, cb) => {
                const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
                cb(null, `${uniqueSuffix}${(0, path_1.extname)(file.originalname)}`);
            },
        }),
        fileFilter: (req, file, cb) => {
            const allowed = [
                'jpg',
                'jpeg',
                'png',
                'gif',
                'webp',
                'mp4',
                'webm',
                'doc',
                'docx',
                'xls',
                'xlsx',
                'ppt',
                'pptx',
                'zip',
                'txt',
            ];
            const ext = (file.originalname.split('.').pop() || '').toLowerCase();
            const mime = file.mimetype;
            if (allowed.includes(ext) ||
                mime.startsWith('image/') ||
                mime.startsWith('video/') ||
                mime === 'application/msword' ||
                mime ===
                    'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
                mime === 'application/vnd.ms-excel' ||
                mime ===
                    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' ||
                mime === 'application/vnd.ms-powerpoint' ||
                mime ===
                    'application/vnd.openxmlformats-officedocument.presentationml.presentation' ||
                mime === 'application/zip' ||
                mime === 'text/plain') {
                cb(null, true);
            }
            else {
                cb(new Error('File type not allowed!'), false);
            }
        },
        limits: { fileSize: 10 * 1024 * 1024 },
    })),
    __param(0, (0, common_1.UploadedFile)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], UploadController.prototype, "uploadFile", null);
exports.UploadController = UploadController = __decorate([
    (0, common_1.UseFilters)(multer_exception_filter_1.MulterExceptionFilter),
    (0, common_1.Controller)('upload')
], UploadController);
//# sourceMappingURL=upload.controller.js.map