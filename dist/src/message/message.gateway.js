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
exports.MessageGateway = void 0;
const websockets_1 = require("@nestjs/websockets");
const socket_io_1 = require("socket.io");
const message_service_1 = require("./message.service");
const common_1 = require("@nestjs/common");
const user_service_1 = require("../user/user.service");
const conversation_service_1 = require("../conversations/conversation.service");
let MessageGateway = class MessageGateway {
    messageService;
    userService;
    conversationService;
    logger = new common_1.Logger('MessageGateway');
    onlineUsers = new Map();
    constructor(messageService, userService, conversationService) {
        this.messageService = messageService;
        this.userService = userService;
        this.conversationService = conversationService;
        this.messageService.setMessageGateway(this);
    }
    server;
    afterInit(server) {
        this.server = server;
        this.logger.log('🚀 Socket server initialized');
    }
    handleConnection(client) {
        this.logger.log(`🟢 Client connected: ${client.id}`);
        client.join('global');
        client.on('register', (userId) => {
            this.onlineUsers.set(userId, client);
            this.logger.log(`📌 User ${userId} registered with socket ${client.id}`);
        });
    }
    async handleDisconnect(client) {
        this.logger.log(`🔴 Client disconnected: ${client.id}`);
        for (const [userId, socket] of this.onlineUsers.entries()) {
            if (socket.id === client.id) {
                this.onlineUsers.delete(userId);
                this.logger.log(`❌ Removed socket of user ${userId}`);
                await this.userService.updateStatus(userId, {
                    isOnline: false,
                    lastSeen: new Date(),
                });
                this.server.to('global').emit('user_status_changed', {
                    userId,
                    isOnline: false,
                    lastSeen: new Date(),
                });
                break;
            }
        }
    }
    async handleUserConnected(client, userId) {
        this.onlineUsers.set(userId, client);
        client.join(userId);
        client.join('global');
        await this.userService.updateStatus(userId, {
            isOnline: true,
            lastSeen: new Date(),
        });
        this.server.to('global').emit('user_status_changed', {
            userId,
            isOnline: true,
            lastSeen: new Date(),
        });
    }
    async handleJoinConversation(payload, client) {
        const { conversationId, userId } = payload;
        client.join(conversationId);
    }
    async handleRequestUserStatus(userId, client) {
        try {
            const user = await this.userService.findById(userId);
            if (user) {
                client.emit('user_status_response', {
                    userId,
                    isOnline: user.isOnline,
                    lastSeen: user.lastSeen,
                });
            }
        }
        catch (error) {
            this.logger.error(`Error getting user status for ${userId}:`, error);
        }
    }
    async handleMessage(payload) {
        const { fromUserId, receiverId, conversationId: providedConversationId, content, type = 'text', mediaUrl = '', mimetype = '', originalName = '', } = payload;
        if (!content && !mediaUrl)
            return;
        try {
            let conversation;
            let conversationId;
            if (providedConversationId) {
                conversation = await this.conversationService.getConversationById(providedConversationId);
                conversationId = providedConversationId;
            }
            else if (receiverId && receiverId.trim()) {
                conversation = await this.conversationService.findOneByMembers([
                    fromUserId,
                    receiverId,
                ]);
                if (!conversation) {
                    conversation = await this.conversationService.createConversation(fromUserId, receiverId);
                }
                conversationId = conversation._id.toString();
            }
            else {
                throw new Error('Invalid receiverId or conversationId');
            }
            const newMessage = await this.messageService.createWithConversationId(fromUserId, conversationId, { content, type, mediaUrl, mimetype, originalName });
            const populatedMessage = await this.messageService.populateMessageSender(newMessage._id);
            if (!populatedMessage) {
                throw new Error('Failed to populate message sender');
            }
            const fullPayload = {
                ...populatedMessage._doc,
                fromUserId,
                conversationId,
                content: populatedMessage.content,
                type: populatedMessage.type,
                mediaUrl: populatedMessage.mediaUrl,
                createdAt: populatedMessage.createdAt || Date.now(),
            };
            this.server.to(conversationId).emit('receive_message', fullPayload);
            if (conversation.deletedBy && conversation.deletedBy.length === 0) {
                conversation.members.forEach((memberId) => {
                    const memberIdStr = typeof memberId === 'object' && memberId._id
                        ? memberId._id.toString()
                        : memberId.toString();
                    this.server.to(memberIdStr).emit('new_conversation_created', {
                        conversation: {
                            _id: conversation._id,
                            isGroup: conversation.isGroup,
                            members: conversation.members,
                            deletedBy: conversation.deletedBy,
                        },
                    });
                });
            }
        }
        catch (error) {
            console.error('Lỗi khi gửi tin nhắn:', error);
        }
    }
};
exports.MessageGateway = MessageGateway;
__decorate([
    (0, websockets_1.SubscribeMessage)('user_connected'),
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __param(1, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, String]),
    __metadata("design:returntype", Promise)
], MessageGateway.prototype, "handleUserConnected", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('join_conversation'),
    __param(0, (0, websockets_1.MessageBody)()),
    __param(1, (0, websockets_1.ConnectedSocket)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, socket_io_1.Socket]),
    __metadata("design:returntype", Promise)
], MessageGateway.prototype, "handleJoinConversation", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('request_user_status'),
    __param(0, (0, websockets_1.MessageBody)()),
    __param(1, (0, websockets_1.ConnectedSocket)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, socket_io_1.Socket]),
    __metadata("design:returntype", Promise)
], MessageGateway.prototype, "handleRequestUserStatus", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('send_message'),
    __param(0, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], MessageGateway.prototype, "handleMessage", null);
exports.MessageGateway = MessageGateway = __decorate([
    (0, websockets_1.WebSocketGateway)({
        cors: {
            origin: '*',
        },
    }),
    __metadata("design:paramtypes", [message_service_1.MessageService,
        user_service_1.UserService,
        conversation_service_1.ConversationService])
], MessageGateway);
//# sourceMappingURL=message.gateway.js.map