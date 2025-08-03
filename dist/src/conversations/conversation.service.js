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
exports.ConversationService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const conversation_schema_1 = require("./conversation.schema");
const user_schema_1 = require("../user/user.schema");
const message_schema_1 = require("../message/message.schema");
let ConversationService = class ConversationService {
    conversationModel;
    userModel;
    messageModel;
    constructor(conversationModel, userModel, messageModel) {
        this.conversationModel = conversationModel;
        this.userModel = userModel;
        this.messageModel = messageModel;
    }
    escapeRegexPattern(pattern) {
        return pattern.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    }
    async createConversation(userId, receiverId, isGroup = false, groupName = '', content, type = 'text', mediaUrl = '') {
        if (!isGroup) {
            const userObjId = new mongoose_2.Types.ObjectId(userId);
            const receiverObjId = new mongoose_2.Types.ObjectId(receiverId);
            const existing = await this.conversationModel.findOne({
                isGroup: false,
                members: { $all: [userObjId, receiverObjId] },
                $expr: { $eq: [{ $size: '$members' }, 2] },
            });
            if (existing) {
                return existing;
            }
            if (!content && !mediaUrl) {
                throw new common_1.BadRequestException('Không thể tạo cuộc trò chuyện rỗng');
            }
            const newConversation = await new this.conversationModel({
                isGroup: false,
                members: [userObjId, receiverObjId],
                createdBy: userObjId,
            }).save();
            await this.messageModel.create({
                conversationId: newConversation._id,
                senderId: userObjId,
                content,
                type,
                mediaUrl,
            });
            await this.updateLastMessage(newConversation._id.toString(), content || '', type, userId);
            return newConversation;
        }
        const receivers = Array.isArray(receiverId) ? receiverId : [receiverId];
        const allMembers = [...new Set([userId, ...receivers])];
        if (allMembers.length < 3) {
            throw new Error('Nhóm phải có ít nhất 3 người');
        }
        if (!groupName || !groupName.trim()) {
            throw new Error('Tên nhóm không được để trống');
        }
        if (!content && !mediaUrl) {
            throw new common_1.BadRequestException('Không thể tạo nhóm rỗng');
        }
        const groupConversation = new this.conversationModel({
            isGroup: true,
            name: groupName,
            avatar: mediaUrl || '',
            members: allMembers.map((id) => new mongoose_2.Types.ObjectId(id)),
            createdBy: new mongoose_2.Types.ObjectId(userId),
        });
        const savedGroup = await groupConversation.save();
        await this.messageModel.create({
            conversationId: savedGroup._id,
            senderId: new mongoose_2.Types.ObjectId(userId),
            content,
            type,
            mediaUrl,
        });
        await this.updateLastMessage(savedGroup._id.toString(), content || '', type, userId);
        return savedGroup;
    }
    async getUserConversations(userId) {
        const conversations = await this.conversationModel.aggregate([
            {
                $match: {
                    members: new mongoose_2.Types.ObjectId(userId),
                    hiddenFromAll: { $ne: true },
                },
            },
            { $sort: { updatedAt: -1 } },
            {
                $addFields: {
                    receiverId: {
                        $cond: [
                            { $eq: ['$isGroup', false] },
                            {
                                $arrayElemAt: [
                                    {
                                        $filter: {
                                            input: '$members',
                                            as: 'member',
                                            cond: { $ne: ['$$member', new mongoose_2.Types.ObjectId(userId)] },
                                        },
                                    },
                                    0,
                                ],
                            },
                            null,
                        ],
                    },
                },
            },
            {
                $lookup: {
                    from: 'users',
                    localField: 'receiverId',
                    foreignField: '_id',
                    as: 'receiver',
                },
            },
            { $unwind: { path: '$receiver', preserveNullAndEmptyArrays: true } },
            {
                $lookup: {
                    from: 'users',
                    localField: 'members',
                    foreignField: '_id',
                    as: 'memberPreviews',
                },
            },
            {
                $project: {
                    _id: 1,
                    isGroup: 1,
                    name: 1,
                    avatar: 1,
                    createdBy: 1,
                    receiver: {
                        _id: 1,
                        username: 1,
                        avatar: 1,
                        nickname: 1,
                        email: 1,
                        gender: 1,
                    },
                    members: 1,
                    memberPreviews: {
                        _id: 1,
                        username: 1,
                        avatar: 1,
                        nickname: 1,
                        email: 1,
                        gender: 1,
                    },
                    lastMessage: '$lastMessage',
                    lastMessageType: '$lastMessageType',
                    lastMessageSenderId: '$lastMessageSenderId',
                    updatedAt: 1,
                    unreadCount: 1,
                    deletedAt: 1,
                    deactivatedAt: 1,
                },
            },
        ]);
        return conversations;
    }
    async findOneByMembers(userIds) {
        const objIds = userIds.map((id) => new mongoose_2.Types.ObjectId(id));
        const result = await this.conversationModel.findOne({
            isGroup: false,
            members: { $all: objIds, $size: 2 },
        });
        return result;
    }
    async getConversationById(id) {
        const conv = await this.conversationModel
            .findById(id)
            .populate('members', 'username avatar email isOnline');
        if (!conv)
            throw new common_1.NotFoundException('Không tìm thấy đoạn chat');
        return conv;
    }
    async deleteConversation(conversationId) {
        const result = await this.conversationModel.deleteOne({
            _id: conversationId,
        });
        return { deleted: result.deletedCount === 1 };
    }
    async deleteConversationForUser(conversationId, userId) {
        await this.conversationModel.findByIdAndUpdate(conversationId, { $set: { [`deletedAt.${userId}`]: new Date() } }, { new: true });
        return { success: true };
    }
    async deactivateGroup(conversationId, userId) {
        const conversation = await this.conversationModel.findById(conversationId);
        if (!conversation)
            throw new common_1.NotFoundException('Không tìm thấy nhóm');
        if (!conversation.isGroup)
            throw new common_1.BadRequestException('Chỉ áp dụng cho nhóm');
        if (conversation.createdBy.toString() !== userId)
            throw new common_1.ForbiddenException('Chỉ admin mới được giải tán nhóm');
        conversation.deactivatedAt = new Date();
        conversation.isActive = false;
        await conversation.save();
        return conversation;
    }
    async searchConversation(userId, query) {
        const escapedQuery = this.escapeRegexPattern(query);
        const conversations = await this.conversationModel.aggregate([
            {
                $match: {
                    hiddenFromAll: { $ne: true },
                },
            },
            {
                $lookup: {
                    from: 'users',
                    localField: 'members',
                    foreignField: '_id',
                    as: 'memberPreviews',
                },
            },
            {
                $addFields: {
                    otherMembers: {
                        $filter: {
                            input: '$memberPreviews',
                            as: 'member',
                            cond: { $ne: ['$$member._id', new mongoose_2.Types.ObjectId(userId)] },
                        },
                    },
                },
            },
            {
                $match: {
                    $or: [
                        { deletedAt: {} },
                        {
                            $expr: {
                                $eq: [
                                    { $getField: { field: userId, input: '$deletedAt' } },
                                    null,
                                ],
                            },
                        },
                    ],
                },
            },
            {
                $match: {
                    $or: [
                        { name: { $regex: escapedQuery, $options: 'i' } },
                        {
                            'otherMembers.username': { $regex: escapedQuery, $options: 'i' },
                        },
                    ],
                },
            },
            {
                $project: {
                    _id: 1,
                    isGroup: 1,
                    name: 1,
                    avatar: 1,
                    members: 1,
                    memberPreviews: { _id: 1, username: 1, avatar: 1 },
                    updatedAt: 1,
                    unreadCount: 1,
                },
            },
            { $sort: { updatedAt: -1 } },
        ]);
        return conversations;
    }
    async searchConversationsByName(name) {
        const escapedName = this.escapeRegexPattern(name);
        const conversations = await this.conversationModel.find({
            name: { $regex: escapedName, $options: 'i' },
        });
        return conversations.map((c) => ({
            _id: String(c._id),
            name: c.name,
            createdBy: c.createdBy ? String(c.createdBy) : null,
        }));
    }
    async updateLastMessage(conversationId, content, type, senderId) {
        return this.conversationModel.findByIdAndUpdate(conversationId, {
            $set: {
                lastMessage: content,
                lastMessageType: type,
                lastMessageSenderId: senderId,
                updatedAt: new Date(),
            },
        }, { new: true });
    }
    async incrementUnreadCount(conversationId, senderId) {
        const conversation = await this.conversationModel.findById(conversationId);
        if (!conversation)
            return;
        if (typeof conversation.unreadCount === 'number') {
            conversation.unreadCount = {};
            await conversation.save();
        }
        const updateOperations = {};
        for (const memberId of conversation.members) {
            const memberIdStr = memberId.toString();
            if (memberIdStr !== senderId.toString()) {
                updateOperations[`unreadCount.${memberIdStr}`] = 1;
            }
        }
        if (Object.keys(updateOperations).length > 0) {
            await this.conversationModel.findByIdAndUpdate(conversationId, { $inc: updateOperations }, { new: true });
        }
    }
    async resetUnreadCount(conversationId, userId) {
        const conversation = await this.conversationModel.findById(conversationId);
        if (!conversation)
            return;
        if (typeof conversation.unreadCount === 'number') {
            conversation.unreadCount = {};
            await conversation.save();
        }
        await this.conversationModel.findByIdAndUpdate(conversationId, { $set: { [`unreadCount.${userId}`]: 0 } }, { new: true });
    }
    async addMembersToGroup(conversationId, memberIds, userId) {
        const conversation = await this.conversationModel.findById(conversationId);
        if (!conversation) {
            throw new common_1.NotFoundException('Không tìm thấy nhóm');
        }
        if (!conversation.isGroup) {
            throw new Error('Chỉ có thể thêm thành viên vào nhóm');
        }
        if (conversation.createdBy.toString() !== userId) {
            throw new Error('Chỉ người tạo nhóm mới được thêm thành viên');
        }
        const newMembers = memberIds.map((id) => new mongoose_2.Types.ObjectId(id));
        const updatedConversation = await this.conversationModel.findByIdAndUpdate(conversationId, {
            $addToSet: { members: { $each: newMembers } },
        }, { new: true });
        return updatedConversation;
    }
    async updateGroup(conversationId, updateData, userId) {
        const conversation = await this.conversationModel.findById(conversationId);
        if (!conversation) {
            throw new common_1.NotFoundException('Không tìm thấy nhóm');
        }
        if (!conversation.isGroup) {
            throw new Error('Chỉ có thể cập nhật thông tin nhóm');
        }
        if (conversation.createdBy.toString() !== userId) {
            throw new Error('Chỉ người tạo nhóm mới được cập nhật thông tin');
        }
        const updatedConversation = await this.conversationModel.findByIdAndUpdate(conversationId, { $set: updateData }, { new: true });
        return updatedConversation;
    }
    async removeMembersFromGroup(conversationId, memberIds, userId) {
        const conversation = await this.conversationModel.findById(conversationId);
        if (!conversation) {
            throw new common_1.NotFoundException('Không tìm thấy nhóm');
        }
        if (!conversation.isGroup) {
            throw new Error('Chỉ có thể xóa thành viên khỏi nhóm');
        }
        if (conversation.createdBy.toString() !== userId) {
            throw new Error('Chỉ người tạo nhóm mới được xóa thành viên');
        }
        const memberObjectIds = memberIds.map((id) => new mongoose_2.Types.ObjectId(id));
        const updatedConversation = await this.conversationModel.findByIdAndUpdate(conversationId, {
            $pull: { members: { $in: memberObjectIds } },
        }, { new: true });
        return updatedConversation;
    }
    async getGroupInfo(conversationId, userId) {
        const conversation = await this.conversationModel.findById(conversationId);
        if (!conversation) {
            throw new common_1.NotFoundException('Không tìm thấy nhóm');
        }
        if (!conversation.isGroup) {
            throw new Error('Chỉ có thể xem thông tin nhóm');
        }
        if (!conversation.members.includes(new mongoose_2.Types.ObjectId(userId))) {
            throw new Error('Bạn không phải thành viên nhóm này');
        }
        const memberDetails = await this.userModel.find({ _id: { $in: conversation.members } }, 'username nickname avatar email');
        return {
            _id: conversation._id,
            name: conversation.name,
            avatar: conversation.avatar,
            createdBy: conversation.createdBy,
            members: memberDetails,
            memberCount: conversation.members.length,
            createdAt: conversation.createdAt,
            updatedAt: conversation.updatedAt,
        };
    }
    async restoreConversation(conversationId) {
        const conversation = await this.conversationModel.findById(conversationId);
        if (!conversation)
            throw new common_1.NotFoundException('Conversation not found');
        conversation.deactivatedAt = null;
        conversation.isActive = true;
        await conversation.save();
        return true;
    }
    async restoreConversationForUser(conversationId, userId) {
        await this.conversationModel.findByIdAndUpdate(conversationId, { $unset: { [`deletedAt.${userId}`]: '' } }, { new: true });
        return { success: true };
    }
};
exports.ConversationService = ConversationService;
exports.ConversationService = ConversationService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(conversation_schema_1.Conversation.name)),
    __param(1, (0, mongoose_1.InjectModel)(user_schema_1.User.name)),
    __param(2, (0, mongoose_1.InjectModel)(message_schema_1.Message.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model])
], ConversationService);
//# sourceMappingURL=conversation.service.js.map