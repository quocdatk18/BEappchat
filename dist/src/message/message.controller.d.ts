import { MessageService } from './message.service';
import { CreateMessageDto } from './dto/create-message.dto';
import { Request } from 'express';
export declare class MessageController {
    private readonly messageService;
    constructor(messageService: MessageService);
    sendMessage(req: Request, messageDto: CreateMessageDto): Promise<import("./message.schema").Message>;
    getMessagesByConversationId(conversationId: string, req: Request): Promise<(import("mongoose").Document<unknown, {}, import("./message.schema").MessageDocument, {}> & import("./message.schema").Message & import("mongoose").Document<unknown, any, any, Record<string, any>> & Required<{
        _id: unknown;
    }> & {
        __v: number;
    })[]>;
    recallMessage(id: string, req: any): Promise<{
        success: boolean;
        message: string;
        code: string;
        data?: undefined;
    } | {
        success: boolean;
        message: string;
        data: (import("mongoose").Document<unknown, {}, import("./message.schema").MessageDocument, {}> & import("./message.schema").Message & import("mongoose").Document<unknown, any, any, Record<string, any>> & Required<{
            _id: unknown;
        }> & {
            __v: number;
        }) | null;
        code?: undefined;
    }>;
    deleteMessageForUser(id: string, req: any): Promise<(import("mongoose").Document<unknown, {}, import("./message.schema").MessageDocument, {}> & import("./message.schema").Message & import("mongoose").Document<unknown, any, any, Record<string, any>> & Required<{
        _id: unknown;
    }> & {
        __v: number;
    }) | null>;
    deleteMessageForAll(id: string, req: any): Promise<{
        success: boolean;
        message: string;
        code: string;
        data?: undefined;
    } | {
        success: boolean;
        message: string;
        data: (import("mongoose").Document<unknown, {}, import("./message.schema").MessageDocument, {}> & import("./message.schema").Message & import("mongoose").Document<unknown, any, any, Record<string, any>> & Required<{
            _id: unknown;
        }> & {
            __v: number;
        }) | null;
        code?: undefined;
    }>;
    markMessageSeen(id: string, req: any): Promise<(import("mongoose").Document<unknown, {}, import("./message.schema").MessageDocument, {}> & import("./message.schema").Message & import("mongoose").Document<unknown, any, any, Record<string, any>> & Required<{
        _id: unknown;
    }> & {
        __v: number;
    }) | null>;
}
