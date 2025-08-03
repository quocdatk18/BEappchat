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
exports.UserController = void 0;
const common_1 = require("@nestjs/common");
const user_service_1 = require("./user.service");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
const get_user_decorator_1 = require("./get-user.decorator");
const user_schema_1 = require("./user.schema");
const update_user_dto_1 = require("./dto/update-user.dto");
const change_password_dto_1 = require("./dto/change-password.dto");
const request_change_email_dto_1 = require("./dto/request-change-email.dto");
const forgot_password_dto_1 = require("./dto/forgot-password.dto");
const change_email_dto_1 = require("./dto/change-email.dto");
const support_request_dto_1 = require("./dto/support-request.dto");
let UserController = class UserController {
    userService;
    constructor(userService) {
        this.userService = userService;
    }
    async getMe(user) {
        return this.userService.findById(user._id);
    }
    async searchUsers(query, user) {
        return this.userService.searchUsers(query, user._id);
    }
    async searchUserByEmail(email, user) {
        const foundUser = await this.userService.searchUserByEmail(email);
        if (foundUser && foundUser._id.toString() !== user._id.toString()) {
            return foundUser;
        }
        return null;
    }
    async getUserById(id) {
        return this.userService.findById(id);
    }
    async changePassword(user, changePasswordDto) {
        try {
            await this.userService.changePassword(user._id, changePasswordDto.currentPassword, changePasswordDto.newPassword);
            return { message: 'Password changed successfully' };
        }
        catch (error) {
            throw new common_1.NotFoundException(error.message);
        }
    }
    async requestChangeEmail(user, requestChangeEmailDto) {
        try {
            await this.userService.requestChangeEmail(user._id, requestChangeEmailDto.currentPassword, requestChangeEmailDto.newEmail, requestChangeEmailDto.reason);
            return { message: 'Email change request sent to support' };
        }
        catch (error) {
            throw new common_1.NotFoundException(error.message);
        }
    }
    async forgotPassword(forgotPasswordDto) {
        try {
            await this.userService.forgotPassword(forgotPasswordDto.email);
            return { message: 'New password has been sent to your email' };
        }
        catch (error) {
            throw new common_1.NotFoundException(error.message);
        }
    }
    async adminChangeEmail(user, changeEmailDto) {
        if (user.role !== 'admin') {
            throw new common_1.NotFoundException('Only Super Admin can change user emails');
        }
        try {
            await this.userService.changeEmail(changeEmailDto.userId, changeEmailDto.newEmail);
            return { message: 'Email changed successfully and notifications sent' };
        }
        catch (error) {
            throw new common_1.NotFoundException(error.message);
        }
    }
    async sendSupportRequest(supportRequestDto) {
        try {
            await this.userService.sendSupportRequest(supportRequestDto);
            return { message: 'Support request sent successfully' };
        }
        catch (error) {
            throw new common_1.NotFoundException(error.message);
        }
    }
    async updateOnlineStatus(id, body, user) {
        if (id !== user._id.toString()) {
            throw new common_1.NotFoundException('Unauthorized');
        }
        await this.userService.updateStatus(id, {
            isOnline: body.isOnline,
            lastSeen: body.isOnline ? undefined : new Date(),
        });
        return { message: 'Status updated successfully' };
    }
    async updateProfile(req, updateUserDto) {
        const userId = req.user._id;
        return this.userService.updateUser(userId, updateUserDto);
    }
};
exports.UserController = UserController;
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Get)('me'),
    __param(0, (0, get_user_decorator_1.GetUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_schema_1.User]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "getMe", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Get)('search'),
    __param(0, (0, common_1.Query)('q')),
    __param(1, (0, get_user_decorator_1.GetUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, user_schema_1.User]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "searchUsers", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Get)('searchByEmail'),
    __param(0, (0, common_1.Query)('email')),
    __param(1, (0, get_user_decorator_1.GetUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, user_schema_1.User]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "searchUserByEmail", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "getUserById", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Post)('change-password'),
    __param(0, (0, get_user_decorator_1.GetUser)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_schema_1.User,
        change_password_dto_1.ChangePasswordDto]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "changePassword", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Post)('request-change-email'),
    __param(0, (0, get_user_decorator_1.GetUser)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_schema_1.User,
        request_change_email_dto_1.RequestChangeEmailDto]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "requestChangeEmail", null);
__decorate([
    (0, common_1.Post)('forgot-password'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [forgot_password_dto_1.ForgotPasswordDto]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "forgotPassword", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Post)('admin/change-email'),
    __param(0, (0, get_user_decorator_1.GetUser)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_schema_1.User,
        change_email_dto_1.ChangeEmailDto]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "adminChangeEmail", null);
__decorate([
    (0, common_1.Post)('support-request'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [support_request_dto_1.SupportRequestDto]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "sendSupportRequest", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Patch)(':id/online'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, get_user_decorator_1.GetUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, user_schema_1.User]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "updateOnlineStatus", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Patch)('profile'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, update_user_dto_1.UpdateUserDto]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "updateProfile", null);
exports.UserController = UserController = __decorate([
    (0, common_1.Controller)('user'),
    __metadata("design:paramtypes", [user_service_1.UserService])
], UserController);
//# sourceMappingURL=user.controller.js.map