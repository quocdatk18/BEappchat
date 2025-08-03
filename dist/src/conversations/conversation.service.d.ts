import { Model, Types } from 'mongoose';
import { Conversation, ConversationDocument } from './conversation.schema';
import { User, UserDocument } from 'src/user/user.schema';
import { MessageDocument } from 'src/message/message.schema';
export declare class ConversationService {
    private conversationModel;
    private userModel;
    private messageModel;
    constructor(conversationModel: Model<ConversationDocument>, userModel: Model<UserDocument>, messageModel: Model<MessageDocument>);
    private escapeRegexPattern;
    createConversation(userId: string, receiverId: string | string[], isGroup?: boolean, groupName?: string, content?: string, type?: string, mediaUrl?: string): Promise<ConversationDocument>;
    getUserConversations(userId: string): Promise<any[]>;
    findOneByMembers(userIds: string[]): Promise<any>;
    getConversationById(id: string): Promise<Conversation>;
    deleteConversation(conversationId: string): Promise<{
        deleted: boolean;
    }>;
    deleteConversationForUser(conversationId: string, userId: string): Promise<{
        success: boolean;
    }>;
    deactivateGroup(conversationId: string, userId: string): Promise<import("mongoose").Document<unknown, {}, ConversationDocument, {}> & Conversation & import("mongoose").Document<unknown, any, any, Record<string, any>> & Required<{
        _id: unknown;
    }> & {
        __v: number;
    }>;
    searchConversation(userId: string, query: string): Promise<any[]>;
    searchConversationsByName(name: string): Promise<{
        _id: string;
        name: string;
        createdBy: string | null;
    }[]>;
    updateLastMessage(conversationId: string, content: string, type: string, senderId: string): Promise<(import("mongoose").Document<unknown, {}, ConversationDocument, {}> & Conversation & import("mongoose").Document<unknown, any, any, Record<string, any>> & Required<{
        _id: unknown;
    }> & {
        __v: number;
    }) | null>;
    incrementUnreadCount(conversationId: string, senderId: string): Promise<void>;
    resetUnreadCount(conversationId: string, userId: string): Promise<void>;
    addMembersToGroup(conversationId: string, memberIds: string[], userId: string): Promise<(import("mongoose").Document<unknown, {}, ConversationDocument, {}> & Conversation & import("mongoose").Document<unknown, any, any, Record<string, any>> & Required<{
        _id: unknown;
    }> & {
        __v: number;
    }) | null>;
    updateGroup(conversationId: string, updateData: {
        name?: string;
        avatar?: string;
    }, userId: string): Promise<(import("mongoose").Document<unknown, {}, ConversationDocument, {}> & Conversation & import("mongoose").Document<unknown, any, any, Record<string, any>> & Required<{
        _id: unknown;
    }> & {
        __v: number;
    }) | null>;
    removeMembersFromGroup(conversationId: string, memberIds: string[], userId: string): Promise<(import("mongoose").Document<unknown, {}, ConversationDocument, {}> & Conversation & import("mongoose").Document<unknown, any, any, Record<string, any>> & Required<{
        _id: unknown;
    }> & {
        __v: number;
    }) | null>;
    getGroupInfo(conversationId: string, userId: string): Promise<{
        _id: unknown;
        name: string;
        avatar: string;
        createdBy: Types.ObjectId;
        members: (import("mongoose").Document<unknown, {}, UserDocument, {}> & User & import("mongoose").Document<unknown, any, any, Record<string, any>> & Required<{
            _id: string;
        }> & {
            __v: number;
        })[];
        memberCount: number;
        createdAt: any;
        updatedAt: any;
    }>;
    restoreConversation(conversationId: string): Promise<boolean>;
    restoreConversationForUser(conversationId: string, userId: string): Promise<{
        success: boolean;
    }>;
}
