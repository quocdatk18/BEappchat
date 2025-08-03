"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MulterExceptionFilter = void 0;
const common_1 = require("@nestjs/common");
const multer_1 = require("multer");
let MulterExceptionFilter = class MulterExceptionFilter {
    catch(exception, host) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse();
        let errorMessage = 'Upload failed';
        switch (exception.code) {
            case 'LIMIT_FILE_SIZE':
                errorMessage = 'File quá lớn (tối đa 10MB)';
                break;
            case 'LIMIT_FILE_COUNT':
                errorMessage = 'Quá nhiều file';
                break;
            case 'LIMIT_UNEXPECTED_FILE':
                errorMessage = 'File không được hỗ trợ';
                break;
            default:
                errorMessage = exception.message || 'Upload failed';
        }
        response.status(400).json({
            statusCode: 400,
            message: errorMessage,
            error: 'Bad Request',
            code: exception.code,
        });
    }
};
exports.MulterExceptionFilter = MulterExceptionFilter;
exports.MulterExceptionFilter = MulterExceptionFilter = __decorate([
    (0, common_1.Catch)(multer_1.MulterError)
], MulterExceptionFilter);
//# sourceMappingURL=multer-exception.filter.js.map