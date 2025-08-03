import { Document, Types } from 'mongoose';
export type MessageDocument = Message & Document;
export declare class Message {
    conversationId: Types.ObjectId;
    senderId: Types.ObjectId;
    content: string;
    type: string;
    mediaUrl: string;
    mimetype: string;
    originalName: string;
    deletedBy: string[];
    seenBy: string[];
    recalled: boolean;
    recallAt: Date;
    deletedForAll: boolean;
    deletedForAllAt: Date;
    deletedForAllBy: string;
}
export declare const MessageSchema: import("mongoose").Schema<Message, import("mongoose").Model<Message, any, any, any, Document<unknown, any, Message, any> & Message & {
    _id: Types.ObjectId;
} & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Message, Document<unknown, {}, import("mongoose").FlatRecord<Message>, {}> & import("mongoose").FlatRecord<Message> & {
    _id: Types.ObjectId;
} & {
    __v: number;
}>;
