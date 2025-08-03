import { ConversationService } from './conversation.service';
import { User } from 'src/user/user.schema';
import { RestoreConversationDto } from './dto/restore-conversation.dto';
export declare class ConversationController {
    private readonly conversationService;
    constructor(conversationService: ConversationService);
    createConversation(req: any, body: {
        receiverId: string | string[];
        isGroup?: boolean;
        groupName?: string;
        content?: string;
        type?: string;
        mediaUrl?: string;
    }): Promise<import("./conversation.schema").ConversationDocument>;
    getMyConversations(req: any): Promise<any[]>;
    searchConversation(req: any, query: string): Promise<any[]>;
    getOneConversation(id: string): Promise<import("./conversation.schema").Conversation>;
    deleteConversation(id: string): Promise<{
        deleted: boolean;
    }>;
    deleteConversationForUser(id: string, req: any): Promise<{
        success: boolean;
    }>;
    addMembersToGroup(id: string, body: {
        memberIds: string[];
    }, req: any): Promise<(import("mongoose").Document<unknown, {}, import("./conversation.schema").ConversationDocument, {}> & import("./conversation.schema").Conversation & import("mongoose").Document<unknown, any, any, Record<string, any>> & Required<{
        _id: unknown;
    }> & {
        __v: number;
    }) | null>;
    updateGroup(id: string, body: {
        name?: string;
        avatar?: string;
    }, req: any): Promise<(import("mongoose").Document<unknown, {}, import("./conversation.schema").ConversationDocument, {}> & import("./conversation.schema").Conversation & import("mongoose").Document<unknown, any, any, Record<string, any>> & Required<{
        _id: unknown;
    }> & {
        __v: number;
    }) | null>;
    removeMembersFromGroup(id: string, body: {
        memberIds: string[];
    }, req: any): Promise<(import("mongoose").Document<unknown, {}, import("./conversation.schema").ConversationDocument, {}> & import("./conversation.schema").Conversation & import("mongoose").Document<unknown, any, any, Record<string, any>> & Required<{
        _id: unknown;
    }> & {
        __v: number;
    }) | null>;
    getGroupInfo(id: string, req: any): Promise<{
        _id: unknown;
        name: string;
        avatar: string;
        createdBy: import("mongoose").Types.ObjectId;
        members: (import("mongoose").Document<unknown, {}, import("src/user/user.schema").UserDocument, {}> & User & import("mongoose").Document<unknown, any, any, Record<string, any>> & Required<{
            _id: string;
        }> & {
            __v: number;
        })[];
        memberCount: number;
        createdAt: any;
        updatedAt: any;
    }>;
    restoreConversation(user: User, body: RestoreConversationDto): Promise<{
        message: string;
    }>;
    adminSearchConversation(user: User, name: string): Promise<{
        _id: string;
        name: string;
        createdBy: string | null;
    }[]>;
    markConversationAsRead(id: string, req: any): Promise<void>;
    restoreConversationForUser(id: string, req: any): Promise<{
        success: boolean;
    }>;
    deactivateGroup(id: string, user: any): Promise<import("mongoose").Document<unknown, {}, import("./conversation.schema").ConversationDocument, {}> & import("./conversation.schema").Conversation & import("mongoose").Document<unknown, any, any, Record<string, any>> & Required<{
        _id: unknown;
    }> & {
        __v: number;
    }>;
}
