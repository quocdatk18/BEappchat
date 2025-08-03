import { OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { MessageService } from './message.service';
import { UserService } from 'src/user/user.service';
import { ConversationService } from '../conversations/conversation.service';
export declare class MessageGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
    private readonly messageService;
    private readonly userService;
    private readonly conversationService;
    private logger;
    private onlineUsers;
    constructor(messageService: MessageService, userService: UserService, conversationService: ConversationService);
    server: Server;
    afterInit(server: Server): void;
    handleConnection(client: Socket): void;
    handleDisconnect(client: Socket): Promise<void>;
    handleUserConnected(client: Socket, userId: string): Promise<void>;
    handleJoinConversation(payload: {
        conversationId: string;
        userId: string;
    }, client: Socket): Promise<void>;
    handleRequestUserStatus(userId: string, client: Socket): Promise<void>;
    handleMessage(payload: {
        fromUserId: string;
        receiverId: string;
        conversationId?: string;
        content?: string;
        type?: 'text' | 'image' | 'file' | 'video';
        mediaUrl?: string;
        mimetype?: string;
        originalName?: string;
    }): Promise<void>;
}
