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
exports.ConversationController = void 0;
const common_1 = require("@nestjs/common");
const conversation_service_1 = require("./conversation.service");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
const get_user_decorator_1 = require("../user/get-user.decorator");
const user_schema_1 = require("../user/user.schema");
const restore_conversation_dto_1 = require("./dto/restore-conversation.dto");
let ConversationController = class ConversationController {
    conversationService;
    constructor(conversationService) {
        this.conversationService = conversationService;
    }
    async createConversation(req, body) {
        const { receiverId, isGroup = false, groupName = '', content, type = 'text', mediaUrl = '', } = body;
        const userId = req.user._id;
        return this.conversationService.createConversation(userId, receiverId, isGroup, groupName, content, type, mediaUrl);
    }
    async getMyConversations(req) {
        const userId = req.user._id.toString();
        return this.conversationService.getUserConversations(userId);
    }
    async searchConversation(req, query) {
        const userId = req.user._id;
        return this.conversationService.searchConversation(userId, query || '');
    }
    async getOneConversation(id) {
        return this.conversationService.getConversationById(id);
    }
    async deleteConversation(id) {
        return this.conversationService.deleteConversation(id);
    }
    async deleteConversationForUser(id, req) {
        const userId = req.user._id;
        return this.conversationService.deleteConversationForUser(id, userId);
    }
    async addMembersToGroup(id, body, req) {
        const userId = req.user._id;
        return this.conversationService.addMembersToGroup(id, body.memberIds, userId);
    }
    async updateGroup(id, body, req) {
        const userId = req.user._id;
        return this.conversationService.updateGroup(id, body, userId);
    }
    async removeMembersFromGroup(id, body, req) {
        const userId = req.user._id;
        return this.conversationService.removeMembersFromGroup(id, body.memberIds, userId);
    }
    async getGroupInfo(id, req) {
        const userId = req.user._id;
        return this.conversationService.getGroupInfo(id, userId);
    }
    async restoreConversation(user, body) {
        if (user.role !== 'admin')
            throw new common_1.ForbiddenException('No permission');
        await this.conversationService.restoreConversation(body.conversationId);
        return { message: 'Conversation restored successfully' };
    }
    async adminSearchConversation(user, name) {
        if (user.role !== 'admin')
            throw new common_1.ForbiddenException('No permission');
        if (!name)
            return [];
        return this.conversationService.searchConversationsByName(name);
    }
    async markConversationAsRead(id, req) {
        const userId = req.user._id;
        return this.conversationService.resetUnreadCount(id, userId);
    }
    async restoreConversationForUser(id, req) {
        const userId = req.user._id;
        return this.conversationService.restoreConversationForUser(id, userId);
    }
    async deactivateGroup(id, user) {
        return this.conversationService.deactivateGroup(id, user._id);
    }
};
exports.ConversationController = ConversationController;
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Post)(),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], ConversationController.prototype, "createConversation", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Get)(),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ConversationController.prototype, "getMyConversations", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Get)('search'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Query)('q')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], ConversationController.prototype, "searchConversation", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ConversationController.prototype, "getOneConversation", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ConversationController.prototype, "deleteConversation", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Patch)(':id/delete'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], ConversationController.prototype, "deleteConversationForUser", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Patch)(':id/add-members'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", Promise)
], ConversationController.prototype, "addMembersToGroup", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Patch)(':id/update'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", Promise)
], ConversationController.prototype, "updateGroup", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Patch)(':id/remove-members'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", Promise)
], ConversationController.prototype, "removeMembersFromGroup", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Get)(':id/group-info'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], ConversationController.prototype, "getGroupInfo", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Post)('admin/restore'),
    __param(0, (0, get_user_decorator_1.GetUser)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_schema_1.User,
        restore_conversation_dto_1.RestoreConversationDto]),
    __metadata("design:returntype", Promise)
], ConversationController.prototype, "restoreConversation", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Get)('admin/search'),
    __param(0, (0, get_user_decorator_1.GetUser)()),
    __param(1, (0, common_1.Query)('name')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_schema_1.User, String]),
    __metadata("design:returntype", Promise)
], ConversationController.prototype, "adminSearchConversation", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Patch)(':id/read'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], ConversationController.prototype, "markConversationAsRead", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Patch)(':id/restore-user'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], ConversationController.prototype, "restoreConversationForUser", null);
__decorate([
    (0, common_1.Patch)(':id/deactivate'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, get_user_decorator_1.GetUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], ConversationController.prototype, "deactivateGroup", null);
exports.ConversationController = ConversationController = __decorate([
    (0, common_1.Controller)('conversations'),
    __metadata("design:paramtypes", [conversation_service_1.ConversationService])
], ConversationController);
//# sourceMappingURL=conversation.controller.js.map