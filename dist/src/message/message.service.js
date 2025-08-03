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
exports.MessageService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const message_schema_1 = require("./message.schema");
const conversation_service_1 = require("../conversations/conversation.service");
let MessageService = class MessageService {
    messageModel;
    conversationService;
    messageGateway = null;
    constructor(messageModel, conversationService) {
        this.messageModel = messageModel;
        this.conversationService = conversationService;
    }
    setMessageGateway(gateway) {
        this.messageGateway = gateway;
    }
    getMessageGateway() {
        return this.messageGateway;
    }
    getConversationService() {
        return this.conversationService;
    }
    async create(senderId, createMessageDto) {
        throw new Error('Use createWithConversationId instead');
    }
    async createWithConversationId(senderId, conversationId, messageData) {
        const { content = '', type = 'text', mediaUrl = '', mimetype = '', originalName = '', } = messageData;
        const conversation = await this.conversationService.getConversationById(conversationId);
        if (!conversation) {
            throw new Error('Conversation not found');
        }
        const isMember = conversation.members.some((member) => {
            let memberId;
            if (member._id) {
                memberId = member._id.toString();
            }
            else {
                memberId = member.toString();
            }
            return memberId === senderId;
        });
        if (!isMember) {
            throw new Error('User is not a member of this conversation');
        }
        if (conversation.deactivatedAt) {
            throw new Error('This conversation has been deactivated');
        }
        if (conversation.deletedAt && conversation.deletedAt[senderId]) {
            await this.conversationService.restoreConversationForUser(conversationId, senderId);
        }
        const message = new this.messageModel({
            senderId: new mongoose_2.Types.ObjectId(senderId),
            conversationId: new mongoose_2.Types.ObjectId(conversationId),
            content,
            type,
            mediaUrl,
            mimetype,
            originalName,
        });
        const savedMessage = await message.save();
        if (content.trim()) {
            await this.conversationService.updateLastMessage(conversationId, content, type, senderId);
        }
        return savedMessage;
    }
    async getConversations(userId) {
        const objectId = new mongoose_2.Types.ObjectId(userId);
        const conversations = await this.messageModel.aggregate([
            {
                $match: {
                    $or: [{ senderId: objectId }, { receiverId: objectId }],
                },
            },
            {
                $sort: { createdAt: -1 },
            },
            {
                $group: {
                    _id: {
                        $cond: [
                            { $eq: ['$senderId', objectId] },
                            '$receiverId',
                            '$senderId',
                        ],
                    },
                    lastMessage: { $first: '$$ROOT' },
                },
            },
            {
                $lookup: {
                    from: 'users',
                    localField: '_id',
                    foreignField: '_id',
                    as: 'user',
                },
            },
            { $unwind: '$user' },
            {
                $project: {
                    _id: '$lastMessage._id',
                    userId: '$user._id',
                    username: '$user.username',
                    avatar: '$user.avatar',
                    content: '$lastMessage.content',
                    createdAt: '$lastMessage.createdAt',
                },
            },
            { $sort: { createdAt: -1 } },
        ]);
        return conversations;
    }
    async getAllMessagesForUser(userId) {
        const conversations = (await this.conversationService.getUserConversations(userId));
        const conversationIds = conversations.map((conv) => conv._id);
        const messages = await this.messageModel
            .find({
            conversationId: { $in: conversationIds },
        })
            .sort({ createdAt: 1 });
        return messages;
    }
    async getMessagesByConversationId(conversationId, userId) {
        let query = {
            conversationId: new mongoose_2.Types.ObjectId(conversationId),
            deletedForAll: { $ne: true },
        };
        if (userId) {
            const conversation = await this.conversationService.getConversationById(conversationId);
            const deletedAt = conversation?.deletedAt?.[userId];
            if (deletedAt)
                query.createdAt = { $gt: deletedAt };
        }
        return this.messageModel
            .find(query)
            .sort({ createdAt: 1 })
            .populate('senderId', 'username avatar gender nickname email');
    }
    async getUserConversations(userId) {
        return this.conversationService.getUserConversations(userId);
    }
    async recallMessage(id, userId) {
        const message = await this.messageModel.findById(id);
        if (!message) {
            return {
                success: false,
                message: 'Message not found',
                code: 'MESSAGE_NOT_FOUND',
            };
        }
        if (message.recalled) {
            return {
                success: false,
                message: 'Message already recalled',
                code: 'MESSAGE_ALREADY_RECALLED',
            };
        }
        const messageTime = new Date(message.createdAt).getTime();
        const currentTime = new Date().getTime();
        const maxRecallTime = 30 * 24 * 60 * 60 * 1000;
        if (currentTime - messageTime > maxRecallTime) {
            return {
                success: false,
                message: 'Cannot recall message older than 30 days',
                code: 'RECALL_TIME_EXPIRED',
            };
        }
        const isSender = message.senderId.toString() === userId;
        if (!isSender) {
            const conversation = await this.conversationService.getConversationById(message.conversationId.toString());
            if (!conversation || !conversation.isGroup) {
                return {
                    success: false,
                    message: 'Only sender can recall message',
                    code: 'UNAUTHORIZED',
                };
            }
            const isAdmin = conversation.createdBy?.toString() === userId;
            if (!isAdmin) {
                return {
                    success: false,
                    message: 'Only admin can recall messages from others in group',
                    code: 'UNAUTHORIZED',
                };
            }
        }
        const updatedMessage = await this.messageModel
            .findByIdAndUpdate(id, { recalled: true, recallAt: new Date() }, { new: true })
            .populate('senderId', 'username avatar gender nickname email');
        return {
            success: true,
            message: 'Message recalled successfully',
            data: updatedMessage,
        };
    }
    async deleteMessageForUser(id, userId) {
        return this.messageModel
            .findByIdAndUpdate(id, { $addToSet: { deletedBy: userId } }, { new: true })
            .populate('senderId', 'username avatar gender nickname email');
    }
    async deleteMessageForAll(id, userId) {
        const message = await this.messageModel.findById(id);
        if (!message) {
            return {
                success: false,
                message: 'Message not found',
                code: 'MESSAGE_NOT_FOUND',
            };
        }
        const conversation = await this.conversationService.getConversationById(message.conversationId.toString());
        if (!conversation || !conversation.isGroup) {
            return {
                success: false,
                message: 'Can only delete messages in group conversations',
                code: 'NOT_GROUP_CONVERSATION',
            };
        }
        const isAdmin = conversation.createdBy?.toString() === userId;
        if (!isAdmin) {
            return {
                success: false,
                message: 'Only admin can delete messages for all users',
                code: 'UNAUTHORIZED',
            };
        }
        if (message.deletedForAll) {
            return {
                success: false,
                message: 'Message already deleted for all users',
                code: 'MESSAGE_ALREADY_DELETED_FOR_ALL',
            };
        }
        const updatedMessage = await this.messageModel
            .findByIdAndUpdate(id, {
            deletedForAll: true,
            deletedForAllAt: new Date(),
            deletedForAllBy: userId,
        }, { new: true })
            .populate('senderId', 'username avatar gender nickname email');
        return {
            success: true,
            message: 'Message deleted for all users',
            data: updatedMessage,
        };
    }
    async markMessageSeen(id, userId) {
        return this.messageModel.findByIdAndUpdate(id, { $addToSet: { seenBy: userId } }, { new: true });
    }
    async populateMessageSender(messageId) {
        return this.messageModel
            .findById(messageId)
            .populate('senderId', 'username avatar gender nickname email');
    }
};
exports.MessageService = MessageService;
exports.MessageService = MessageService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(message_schema_1.Message.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        conversation_service_1.ConversationService])
], MessageService);
//# sourceMappingURL=message.service.js.map