import { Model } from 'mongoose';
import { Message, MessageDocument } from './message.schema';
import { CreateMessageDto } from './dto/create-message.dto';
import { ConversationService } from '../conversations/conversation.service';
import { MessageGateway } from './message.gateway';
export declare class MessageService {
    private messageModel;
    private conversationService;
    private messageGateway;
    constructor(messageModel: Model<MessageDocument>, conversationService: ConversationService);
    setMessageGateway(gateway: MessageGateway): void;
    getMessageGateway(): MessageGateway | null;
    getConversationService(): ConversationService;
    create(senderId: string, createMessageDto: CreateMessageDto): Promise<Message>;
    createWithConversationId(senderId: string, conversationId: string, messageData: {
        content?: string;
        type?: 'text' | 'image' | 'file' | 'video';
        mediaUrl?: string;
        mimetype?: string;
        originalName?: string;
    }): Promise<Message>;
    getConversations(userId: string): Promise<any[]>;
    getAllMessagesForUser(userId: string): Promise<(import("mongoose").Document<unknown, {}, MessageDocument, {}> & Message & import("mongoose").Document<unknown, any, any, Record<string, any>> & Required<{
        _id: unknown;
    }> & {
        __v: number;
    })[]>;
    getMessagesByConversationId(conversationId: string, userId?: string): Promise<(import("mongoose").Document<unknown, {}, MessageDocument, {}> & Message & import("mongoose").Document<unknown, any, any, Record<string, any>> & Required<{
        _id: unknown;
    }> & {
        __v: number;
    })[]>;
    getUserConversations(userId: string): Promise<any[]>;
    recallMessage(id: string, userId: string): Promise<{
        success: boolean;
        message: string;
        code: string;
        data?: undefined;
    } | {
        success: boolean;
        message: string;
        data: (import("mongoose").Document<unknown, {}, MessageDocument, {}> & Message & import("mongoose").Document<unknown, any, any, Record<string, any>> & Required<{
            _id: unknown;
        }> & {
            __v: number;
        }) | null;
        code?: undefined;
    }>;
    deleteMessageForUser(id: string, userId: string): Promise<(import("mongoose").Document<unknown, {}, MessageDocument, {}> & Message & import("mongoose").Document<unknown, any, any, Record<string, any>> & Required<{
        _id: unknown;
    }> & {
        __v: number;
    }) | null>;
    deleteMessageForAll(id: string, userId: string): Promise<{
        success: boolean;
        message: string;
        code: string;
        data?: undefined;
    } | {
        success: boolean;
        message: string;
        data: (import("mongoose").Document<unknown, {}, MessageDocument, {}> & Message & import("mongoose").Document<unknown, any, any, Record<string, any>> & Required<{
            _id: unknown;
        }> & {
            __v: number;
        }) | null;
        code?: undefined;
    }>;
    markMessageSeen(id: string, userId: string): Promise<(import("mongoose").Document<unknown, {}, MessageDocument, {}> & Message & import("mongoose").Document<unknown, any, any, Record<string, any>> & Required<{
        _id: unknown;
    }> & {
        __v: number;
    }) | null>;
    populateMessageSender(messageId: string): Promise<(import("mongoose").Document<unknown, {}, MessageDocument, {}> & Message & import("mongoose").Document<unknown, any, any, Record<string, any>> & Required<{
        _id: unknown;
    }> & {
        __v: number;
    }) | null>;
}
