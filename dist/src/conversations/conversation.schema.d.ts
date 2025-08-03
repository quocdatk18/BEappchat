import { Document, Types } from 'mongoose';
export type ConversationDocument = Conversation & Document;
export declare class Conversation {
    isGroup: boolean;
    name: string;
    members: Types.ObjectId[];
    createdBy: Types.ObjectId;
    avatar: string;
    admins: Types.ObjectId[];
    isActive: boolean;
    deleted: boolean;
    lastMessage: string;
    lastMessageType: string;
    lastMessageSenderId: string;
    unreadCount: Record<string, number>;
    deletedAt: Record<string, Date>;
    deactivatedAt?: Date | null;
}
export declare const ConversationSchema: import("mongoose").Schema<Conversation, import("mongoose").Model<Conversation, any, any, any, Document<unknown, any, Conversation, any> & Conversation & {
    _id: Types.ObjectId;
} & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Conversation, Document<unknown, {}, import("mongoose").FlatRecord<Conversation>, {}> & import("mongoose").FlatRecord<Conversation> & {
    _id: Types.ObjectId;
} & {
    __v: number;
}>;
