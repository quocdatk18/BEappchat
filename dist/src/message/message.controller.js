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
exports.MessageController = void 0;
const common_1 = require("@nestjs/common");
const message_service_1 = require("./message.service");
const create_message_dto_1 = require("./dto/create-message.dto");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
let MessageController = class MessageController {
    messageService;
    constructor(messageService) {
        this.messageService = messageService;
    }
    async sendMessage(req, messageDto) {
        const senderId = req.user?.['_id'];
        if (!senderId) {
            throw new common_1.UnauthorizedException('Unauthorized');
        }
        const { receiverId, content, type, mediaUrl } = messageDto;
        const conversationService = this.messageService.getConversationService();
        let conversation = await conversationService.findOneByMembers([
            senderId,
            receiverId,
        ]);
        if (conversation && conversation.deletedAt) {
            const senderDeleted = conversation.deletedAt[senderId];
            const receiverDeleted = conversation.deletedAt[receiverId];
            if (senderDeleted && receiverDeleted) {
                conversation = null;
            }
            else if (senderDeleted) {
                await conversationService.restoreConversationForUser(conversation._id.toString(), senderId);
            }
        }
        if (!conversation) {
            conversation = await conversationService.createConversation(senderId, receiverId);
        }
        return this.messageService.createWithConversationId(senderId, conversation._id.toString(), { content, type, mediaUrl });
    }
    async getMessagesByConversationId(conversationId, req) {
        const userId = req.user?.['_id'];
        return this.messageService.getMessagesByConversationId(conversationId, userId);
    }
    async recallMessage(id, req) {
        const userId = req.user._id;
        const result = await this.messageService.recallMessage(id, userId);
        if (result.success && result.data) {
            const messageGateway = this.messageService.getMessageGateway();
            if (messageGateway) {
                messageGateway.server
                    .to(result.data.conversationId.toString())
                    .emit('message_recalled', {
                    messageId: id,
                    conversationId: result.data.conversationId,
                });
            }
        }
        return result;
    }
    async deleteMessageForUser(id, req) {
        const userId = req.user._id;
        const updatedMessage = await this.messageService.deleteMessageForUser(id, userId);
        const messageGateway = this.messageService.getMessageGateway();
        if (messageGateway && updatedMessage) {
            messageGateway.server
                .to(updatedMessage.conversationId.toString())
                .emit('message_deleted', {
                messageId: id,
                conversationId: updatedMessage.conversationId,
                userId: userId,
            });
        }
        return updatedMessage;
    }
    async deleteMessageForAll(id, req) {
        const userId = req.user._id;
        const result = await this.messageService.deleteMessageForAll(id, userId);
        if (result.success && result.data) {
            const messageGateway = this.messageService.getMessageGateway();
            if (messageGateway) {
                messageGateway.server
                    .to(result.data.conversationId.toString())
                    .emit('message_deleted_for_all', {
                    messageId: id,
                    conversationId: result.data.conversationId,
                    userId: userId,
                    deletedForAll: true,
                    deletedForAllAt: result.data.deletedForAllAt,
                    deletedForAllBy: result.data.deletedForAllBy,
                });
            }
        }
        return result;
    }
    async markMessageSeen(id, req) {
        const userId = req.user._id;
        return this.messageService.markMessageSeen(id, userId);
    }
};
exports.MessageController = MessageController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, create_message_dto_1.CreateMessageDto]),
    __metadata("design:returntype", Promise)
], MessageController.prototype, "sendMessage", null);
__decorate([
    (0, common_1.Get)('conversation/:conversationId'),
    __param(0, (0, common_1.Param)('conversationId')),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], MessageController.prototype, "getMessagesByConversationId", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Patch)(':id/recall'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], MessageController.prototype, "recallMessage", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Patch)(':id/delete'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], MessageController.prototype, "deleteMessageForUser", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Delete)(':id/delete-for-all'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], MessageController.prototype, "deleteMessageForAll", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Patch)(':id/seen'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], MessageController.prototype, "markMessageSeen", null);
exports.MessageController = MessageController = __decorate([
    (0, common_1.Controller)('messages'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [message_service_1.MessageService])
], MessageController);
//# sourceMappingURL=message.controller.js.map