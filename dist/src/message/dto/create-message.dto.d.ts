export declare class CreateMessageDto {
    receiverId: string;
    content?: string;
    type?: 'text' | 'image' | 'file' | 'video';
    mediaUrl?: string;
}
